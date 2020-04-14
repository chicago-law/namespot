import React, { useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { setTask, selectTable, setChoosingPoint, loadTempTable, updateTempTable, saveTempTable } from '../../store/session/actions'
import { AppState } from '../../store'
import { SessionState, TempTable } from '../../store/session/types'
import styled from '../../utils/styledComponents'
import ActionBarButton from './ActionBarButton'
import ActionBarDivider from './ActionBarDivider'
import TextButton from '../TextButton'
import startPoint from '../../../images/start-point.svg'
import curvePoint from '../../../images/curve-point.svg'
import endPoint from '../../../images/end-point.svg'
import labelPosition from '../../../images/label-position.png'
import { TablesState } from '../../store/tables/types'
import { setModal } from '../../store/modal/actions'
import { ModalTypes } from '../../store/modal/types'
import { LabelPositionModalData } from '../modals/label-position/LabelPosition'
import useReturnKeyListener from '../../hooks/useReturnKeyListener'
import { deleteTableSeats } from '../../store/seats/actions'
import { DeleteTableModalData } from '../modals/delete-table/DeleteTable'
import NudgeControls from './NudgeControls'
import { Offering } from '../../store/offerings/types'
import { Enrollments } from '../../store/enrollments/types'
import { Seat } from '../../store/seats/types'
import { removeAllEnrollments } from '../../store/enrollments/actions'
import { validateTempTable } from '../../utils/validateTempTable'
import useEscapeKeyListener from '../../hooks/useEscapeKeyListener'

const Container = styled('div')`
  display: flex;
  justify-content: space-between;
  section {
    display: flex;
    align-items: center;
  }
  .seat-count {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-right: 1em;
    input {
      width: 3.25em;
      margin-bottom: 0.25em;
      text-align: center;
      font-size: ${props => props.theme.ms(1)};
    }
    span {
      font-size: ${props => props.theme.ms(-1)};
      line-height: 1.15;
    }
  }
  .text-button {
    margin: 0 1em;
  }
`

interface StoreProps {
  offering: Offering | null;
  enrollments: Enrollments | null;
  tables: TablesState;
  seats: { [seatId: string]: Seat | undefined };
  session: SessionState;
}
interface OwnProps {
  actionBarRef: HTMLDivElement | null;
}
interface RouteParams {
  roomId: string;
  offeringId?: string;
}

const EditTable = ({
  offering,
  enrollments,
  tables,
  seats,
  session,
  actionBarRef,
  match,
}: StoreProps & OwnProps & RouteComponentProps<RouteParams>) => {
  const dispatch = useDispatch()
  const { params } = match
  const roomTables = tables[params.roomId]
  const table = session.selectedTable && roomTables
    ? roomTables[session.selectedTable]
    : null
  const { tempTable } = session
  const [seatCount, setSeatCount] = useState((table && table.seat_count) || 0)

  function resetAndExit() {
    dispatch(setTask(null))
    dispatch(selectTable(null))
    dispatch(setChoosingPoint(null))
    dispatch(loadTempTable(null))
    dispatch(deleteTableSeats('temp'))
  }

  function handleSelectPoint(pointType: 'start' | 'curve' | 'end') {
    if (pointType !== session.choosingPoint) {
      dispatch(setChoosingPoint(pointType))
      dispatch(setTask('choose-point'))
      if (table && !tempTable) dispatch(loadTempTable(table))
    } else {
      dispatch(setChoosingPoint(null))
      dispatch(setTask('edit-table'))
    }
  }

  function handleSeatCountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSeatCount(parseInt(e.target.value))
    dispatch(updateTempTable({
      seat_count: parseInt(e.target.value),
    }))
  }

  function handleSave() {
    if (session.tempTable) {
      dispatch(saveTempTable(session.tempTable, () => {
        // Clear out the seating data so we pull it fresh.
        dispatch(removeAllEnrollments())
        resetAndExit()
      }))
    }
  }

  function handleLabelPosition() {
    if (table) {
      dispatch(setModal<LabelPositionModalData>(ModalTypes.labelPosition, {
        tableId: table.id,
      }))
    }
  }

  function handleRemoveTable() {
    if (tempTable && tempTable.id !== 'temp') {
      dispatch(setModal<DeleteTableModalData>(ModalTypes.deleteTable, {
        tableId: tempTable.id,
        roomId: tempTable.room_id,
        onConfirm: () => {
          // Clear out the seating data so we pull it fresh.
          dispatch(removeAllEnrollments())
          resetAndExit()
        },
      }))
    } else {
      resetAndExit()
    }
  }

  useEscapeKeyListener(resetAndExit)
  useReturnKeyListener(handleSave)

  return (
    <Container>
      <section>
        <ActionBarButton
          text={<>Select<br />Start Point</>}
          image={startPoint}
          handler={() => handleSelectPoint('start')}
          isActive={session.choosingPoint === 'start'}
        />
        <ActionBarButton
          text={<>Select<br />Curve Point</>}
          image={curvePoint}
          handler={() => handleSelectPoint('curve')}
          isActive={session.choosingPoint === 'curve'}
        />
        <ActionBarButton
          text={<>Select<br />End Point</>}
          image={endPoint}
          handler={() => handleSelectPoint('end')}
          isActive={session.choosingPoint === 'end'}
        />
        <ActionBarDivider />
        <div className="seat-count">
          <input
            type="number"
            value={seatCount}
            onChange={handleSeatCountChange}
            min="0"
          />
          <span>Number of<br />Seats</span>
        </div>
        <ActionBarButton
          text={<>Label Position:<br />{(tempTable && tempTable.label_position) || 'below'}</>}
          image={labelPosition}
          handler={handleLabelPosition}
        />
        <ActionBarDivider />
        <NudgeControls
          tempTable={tempTable}
          updateTempTable={(updates: Partial<TempTable>) => dispatch(updateTempTable(updates))}
        />
        <ActionBarDivider />
        <ActionBarButton
          text="Delete Table"
          icon={['far', 'trash-alt']}
          handler={handleRemoveTable}
        />
        <ActionBarDivider />
      </section>
      <section>
        <TextButton
          text="Cancel"
          clickHandler={resetAndExit}
          variant="clear"
        />
        <TextButton
          text="Save Table"
          clickHandler={handleSave}
          variant="red"
          disabled={!tempTable ? true : validateTempTable(tempTable).length !== 0}
        />
      </section>
    </Container>
  )
}

const mapState = ({
  offerings,
  enrollments,
  tables,
  seats,
  session,
}: AppState, {
  match,
}: RouteComponentProps<RouteParams>) => {
  const { roomId, offeringId } = match.params
  return {
    offering: offeringId ? offerings[offeringId] : null,
    enrollments: offeringId ? enrollments[offeringId] : null,
    tables,
    seats: seats[roomId] || {},
    session,
  }
}

export default withRouter(connect(mapState)(EditTable))
