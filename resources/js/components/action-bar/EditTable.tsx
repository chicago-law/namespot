import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { setTask, selectTable, setChoosingPoint, loadTempTable, updateTempTable, saveTempTable } from '../../store/session/actions'
import { AppState } from '../../store'
import { SessionState } from '../../store/session/types'
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
import { assignSeat } from '../../store/enrollments/actions'
import { validateTempTable } from '../../utils/validateTempTable'

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
      font-size: ${(props) => props.theme.ms(1)};
    }
    span {
      font-size: ${(props) => props.theme.ms(-1)};
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
  seats: { [seatId: string]: Seat };
  session: SessionState;
  setTask: typeof setTask;
  selectTable: typeof selectTable;
  loadTempTable: typeof loadTempTable;
  setChoosingPoint: typeof setChoosingPoint;
  updateTempTable: typeof updateTempTable;
  saveTempTable: typeof saveTempTable;
  deleteTableSeats: typeof deleteTableSeats;
  setModal: typeof setModal;
  assignSeat: typeof assignSeat;
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
  setTask,
  selectTable,
  loadTempTable,
  setChoosingPoint,
  updateTempTable,
  saveTempTable,
  deleteTableSeats,
  setModal,
  assignSeat,
  actionBarRef,
  match,
}: StoreProps & OwnProps & RouteComponentProps<RouteParams>) => {
  const { params } = match
  const roomTables = tables[params.roomId]
  const table = session.selectedTable && roomTables
    ? roomTables[session.selectedTable]
    : null
  const { tempTable } = session
  const [seatCount, setSeatCount] = useState((table && table.seat_count) || 0)

  function resetAndExit() {
    setTask(null)
    selectTable(null)
    setChoosingPoint(null)
    loadTempTable(null)
    deleteTableSeats('temp')
  }

  function handleSelectPoint(pointType: 'start' | 'curve' | 'end') {
    if (pointType !== session.choosingPoint) {
      setChoosingPoint(pointType)
      setTask('choose-point')
      if (table && !tempTable) loadTempTable(table)
    } else {
      setChoosingPoint(null)
      setTask('edit-table')
    }
  }

  function handleSeatCountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSeatCount(parseInt(e.target.value))
    updateTempTable({
      seat_count: parseInt(e.target.value),
    })
  }

  function removeBadSeating() {
    if (offering && enrollments && Object.keys(seats).length) {
      Object.values(enrollments).forEach((enrollment) => {
        if (enrollment.seat && !(enrollment.seat in seats)) {
          // eslint-disable-next-line
          console.log(`deleting seat ${enrollment.seat} for student ID ${enrollment.student_id}`)
          assignSeat(offering.id, enrollment.student_id, null)
        }
      })
    }
  }

  function handleSave() {
    if (session.tempTable) {
      saveTempTable(session.tempTable, () => {
        resetAndExit()
        removeBadSeating()
      })
    }
  }

  function handleLabelPosition() {
    if (table) {
      setModal<LabelPositionModalData>(ModalTypes.labelPosition, {
        tableId: table.id,
      })
    }
  }

  function handleRemoveTable() {
    if (tempTable && tempTable.id !== 'temp') {
      setModal<DeleteTableModalData>(ModalTypes.deleteTable, {
        tableId: tempTable.id,
        roomId: tempTable.room_id,
        onConfirm: resetAndExit,
      })
    } else {
      resetAndExit()
    }
  }

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
          updateTempTable={updateTempTable}
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

export default withRouter(connect(mapState, {
  setTask,
  selectTable,
  loadTempTable,
  setChoosingPoint,
  updateTempTable,
  saveTempTable,
  deleteTableSeats,
  setModal,
  assignSeat,
})(EditTable))
