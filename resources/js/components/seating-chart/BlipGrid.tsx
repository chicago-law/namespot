import React from 'react'
import { connect } from 'react-redux'
import styled from '../../utils/styledComponents'
import { AppState } from '../../store'
import { SessionState } from '../../store/session/types'
import { updateTempTable } from '../../store/session/actions'
import gridDimensions from '../../utils/gridDimensions'
import { Tables, Table } from '../../store/tables/types'

const Container = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  .blip {
    position: absolute;
    height: 10px;
    width: 10px;
    transform: translate(-50%, -50%);
    transform-origin: center;
    border-radius: 100%;
    background: #d9d9d9;
    transition: transform 100ms ${props => props.theme.bounce}, background 100ms ease-out;
  }
  &.choosing-point {
    .blip {
      cursor: pointer;
      &.in-inactive-table {
        background: ${props => props.theme.middleGray};
        transform: translate(-50%, -50%) scale(1.25);
      }
      &.in-temp-table {
        background: ${props => props.theme.blue};
        transform: translate(-50%, -50%) scale(1.5);
      }
      &.selected, &:hover {
        transform: translate(-50%, -50%) scale(2);
      }
      &:hover {
        background: ${props => props.theme.middleGray};
      }
      &.selected {
        background: ${props => props.theme.red};
      }
    }
  }
`

interface StoreProps {
  session: SessionState;
  tables: Tables | undefined;
  updateTempTable: typeof updateTempTable;
}
interface OwnProps {
  roomId: string;
  roomPxDimensions: {
    height: number;
    width: number;
  };
}

const BlipGrid = ({
  session,
  tables,
  roomPxDimensions,
  updateTempTable,
}: StoreProps & OwnProps) => {
  const { tempTable } = session
  const rowHeight = roomPxDimensions.height / gridDimensions.rows
  const columnWidth = roomPxDimensions.width / gridDimensions.columns
  const tempStart = tempTable ? `${tempTable.sX}_${tempTable.sY}` : null
  const tempCurve = (tempTable && tempTable.qX) ? `${tempTable.qX}_${tempTable.qY}` : null
  const tempEnd = tempTable ? `${tempTable.eX}_${tempTable.eY}` : null
  const otherTableCoords: string[] = []
  if (tables) {
    Object.keys(tables).forEach(tableId => {
      const table = tables[tableId] as Table
      otherTableCoords.push(`${table.sX}_${table.sY}`)
      otherTableCoords.push(`${table.eX}_${table.eY}`)
      if (table.qX !== null && table.qY !== null) otherTableCoords.push(`${table.qX}_${table.qY}`)
    })
  }

  function getBlipClass(coord: string) {
    let result = 'blip'
    const isTempStart = coord === tempStart
    const isTempCurve = coord === tempCurve
    const isTempEnd = coord === tempEnd
    if (isTempStart || isTempCurve || isTempEnd) {
      result += ' in-temp-table'
      if ((isTempStart && session.choosingPoint === 'start')
        || (isTempCurve && session.choosingPoint === 'curve')
        || (isTempEnd && session.choosingPoint === 'end')
      ) {
        result += ' selected'
      }
    } else if (otherTableCoords.includes(coord)) {
      result += ' in-inactive-table'
    }
    return result
  }

  function createGrid() {
    const blips = []
    for (let r = 0; r < gridDimensions.rows; r += 1) {
      for (let c = 0; c < gridDimensions.columns; c += 1) {
        const coord = `${c}_${r}`
        blips.push(
          <div
            className={getBlipClass(coord)}
            id={coord}
            key={coord}
            style={{
              top: parseFloat((r * rowHeight + rowHeight / 2).toFixed(4)),
              left: parseFloat((c * columnWidth + columnWidth / 2).toFixed(4)),
            }}
          />,
        )
      }
    }
    return blips
  }

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (session.choosingPoint) {
      // format this into type of point (s, e, q) and the x and y coords
      const blip = e.target as HTMLDivElement
      // If you clicked around a blip but not on one, ignore your click.
      if (blip.classList.contains('blip')) {
        const { id } = blip
        const [x, y] = id.split('_')
        let p // Set p to the single letter abbreviation for the point type being chosen.
        switch (session.choosingPoint) {
          case 'start':
          case 'end':
            p = session.choosingPoint.substr(0, 1)
            break
          case 'curve':
            p = 'q'
            break
          default:
        }
        let update = {}
        // If you're clicking the point that's already selected, we can do something different.
        if (session.tempTable
          && ((session.tempTable.sX === parseInt(x) && session.tempTable.sY === parseInt(y))
            || (session.tempTable.qX === parseInt(x) && session.tempTable.qY === parseInt(y))
            || (session.tempTable.eX === parseInt(x) && session.tempTable.eY === parseInt(y))
          )
        ) {
          update = {
            [`${p}X`]: null,
            [`${p}Y`]: null,
          }
        } else {
          update = {
            [`${p}X`]: parseInt(x),
            [`${p}Y`]: parseInt(y),
          }
        }
        updateTempTable(update)
      }
    }
  }

  return (
    <Container
      id="blip-grid-container"
      className={session.task === 'choose-point' ? 'choosing-point' : ''}
      onClick={e => handleClick(e)}
    >
      {createGrid()}
    </Container>
  )
}

const mapState = ({ session, tables }: AppState, { roomId }: OwnProps) => ({
  session,
  tables: tables[roomId],
})

export default connect(mapState, {
  updateTempTable,
})(BlipGrid)
