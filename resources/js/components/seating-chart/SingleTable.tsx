import React, { useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { Table } from '../../store/tables/types'
import { receiveTableSeats } from '../../store/seats/actions'
import { Seat } from '../../store/seats/types'
import { AppState } from '../../store'
import { SessionState } from '../../store/session/types'

interface StoreProps {
  session: SessionState;
  receiveTableSeats: typeof receiveTableSeats;
}
interface OwnProps {
  table: Table;
  rowHeight: number;
  columnWidth: number;
  clickHandler: (e: React.MouseEvent<SVGElement>) => void;
  isBeingTemped?: boolean;
}

const SingleTable = ({
  session,
  table,
  rowHeight,
  columnWidth,
  receiveTableSeats,
  clickHandler,
  isBeingTemped,
}: OwnProps & StoreProps) => {
  const pathRef = useRef<SVGPathElement>(null)
  const { selectedTable } = session

  function calculatePath() {
    const { sX, sY, eX, eY, qX, qY } = table

    // Are all our required coordinates there?
    if (sX !== null && sY !== null && eX !== null && eY !== null) {
      // Are optional curve coordinates there?
      if (qX !== null && qY !== null) {
        return `M ${parseFloat((sX * columnWidth + columnWidth / 2).toFixed(4))}
                  ${parseFloat((sY * rowHeight + rowHeight / 2).toFixed(4))}
                Q ${parseFloat((qX * columnWidth + columnWidth / 2).toFixed(4))}
                  ${parseFloat((qY * rowHeight + rowHeight / 2).toFixed(4))}
                  ${parseFloat((eX * columnWidth + columnWidth / 2).toFixed(4))}
                  ${parseFloat((eY * rowHeight + rowHeight / 2).toFixed(4))}`
      }
      return `M ${parseFloat((sX * columnWidth + columnWidth / 2).toFixed(4))}
                ${parseFloat((sY * rowHeight + rowHeight / 2).toFixed(4))}
              L ${parseFloat((eX * columnWidth + columnWidth / 2).toFixed(4))}
                ${parseFloat((eY * rowHeight + rowHeight / 2).toFixed(4))}`
    }
    return ''
  }

  useEffect(() => {
    if (pathRef.current) {
      const pathLength = pathRef.current.getTotalLength()
      const seats: { [seatId: string]: Seat } = {}
      for (let i = 0; i < table.seat_count; i += 1) {
        const seatId = `${table.id}_${i}`
        const coords = i === 0
          ? pathRef.current.getPointAtLength(0)
          : pathRef.current.getPointAtLength((pathLength / (table.seat_count - 1)) * i)

        seats[seatId] = {
          id: seatId,
          tableId: table.id,
          roomId: table.room_id,
          x: coords.x,
          y: coords.y,
          labelPosition: table.label_position,
        }
      }
      // Load the seats into the store.
      receiveTableSeats(table.room_id, table.id, seats)
    }
  }, [table, session.tempTable, rowHeight, columnWidth, receiveTableSeats])

  function getTablePathClassNames() {
    if (selectedTable) {
      if (selectedTable === table.id) {
        return 'selected'
      }
      return 'not-selected'
    }
    return ''
  }

  return (
    <g onClick={clickHandler} className={isBeingTemped ? 'is-being-temped' : ''}>
      <path
        ref={pathRef}
        className={getTablePathClassNames()}
        d={calculatePath()}
      />
    </g>
  )
}

const mapState = ({ session }: AppState) => ({
  session,
})

export default connect(mapState, {
  receiveTableSeats,
})(React.memo(SingleTable))
