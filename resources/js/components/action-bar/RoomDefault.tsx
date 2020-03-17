import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'
import styled from '../../utils/styledComponents'
import ActionBarInfoColumn from './ActionBarInfoColumn'
import ActionBarButton from './ActionBarButton'
import ActionBarDivider from './ActionBarDivider'
import { AppState } from '../../store'
import { Room } from '../../store/rooms/types'
import { SeatsState } from '../../store/seats/types'
import { setTask, loadTempTable, setChoosingPoint } from '../../store/session/actions'
import { TempTable } from '../../store/session/types'
import { updateRoom } from '../../store/rooms/actions'
import TextButton from '../TextButton'
import { setModal } from '../../store/modal/actions'
import { ModalTypes } from '../../store/modal/types'
import { ChangeRoomModalData } from '../modals/change-room'
import IconButton from '../IconButton'
import { EditTextInputModalData } from '../modals/edit-text-input'
import { theme } from '../../utils/theme'
import { initiatePrint } from '../../store/printing/actions'

const Container = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .right {
    display: flex;
    align-items: center;
    height: 100%;
  }
  .seat-size-slider {
    height: 100%;
    padding: 1em;
    text-align: center;
    p {
      font-size: ${(props) => props.theme.ms(-1)};
    }
    .row {
      display: inline-flex;
      align-items: center;
    }
    .smaller, .larger {
      border: 2px solid ${(props) => props.theme.darkGray};
      border-radius: 4px;
    }
    .smaller {
      height: 1.25em;
      width: 1.25em;
    }
    .larger {
      height: 3em;
      width: 3em;
    }
    input {
      margin: 0 1em;
      max-width: 5em;
      box-shadow: initial;
    }
  }
`

interface StoreProps {
  room: Room;
  seats: SeatsState;
  setTask: typeof setTask;
  loadTempTable: typeof loadTempTable;
  setChoosingPoint: typeof setChoosingPoint;
  updateRoom: typeof updateRoom;
  initiatePrint: typeof initiatePrint;
  setModal: typeof setModal;
}

const RoomDefault = ({
  room,
  seats,
  setTask,
  loadTempTable,
  setChoosingPoint,
  updateRoom,
  initiatePrint,
  setModal,
  history,
  match,
}: StoreProps & RouteComponentProps<{ roomId: string; offeringId?: string }>) => {
  const currentSeats = seats[room.id]
  const isCustom = !!match.params.roomId && !!match.params.offeringId

  function handleEditName() {
    setModal<EditTextInputModalData>(ModalTypes.editTextInput, {
      title: 'Edit Room Name',
      previousValue: room.name ? room.name : '',
      onConfirm: (text: string) => updateRoom(room.id, {
        name: text,
      }),
    })
  }

  function handleAddTable() {
    const defaultTempTable: TempTable = {
      id: 'temp',
      room_id: room.id,
      sX: null,
      sY: null,
      eX: null,
      eY: null,
      qX: null,
      qY: null,
      seat_count: 0,
      label_position: 'below',
    }
    setTask('choose-point')
    setChoosingPoint('start')
    loadTempTable(defaultTempTable)
  }

  function handleSeatSize(seatSize: number) {
    updateRoom(room.id, {
      seat_size: seatSize,
    })
  }

  const [throttledSeatSlide] = useDebouncedCallback((seatSize: number) => {
    handleSeatSize(seatSize)
  }, 100)

  function handlePrint() {
    initiatePrint('seating-chart', {})
  }

  function handleContinueSeating() {
    if (match.params.offeringId) {
      history.push(`/offerings/${match.params.offeringId}`)
    }
  }

  function handleChangeRoom() {
    if (match.params.offeringId) {
      setModal<ChangeRoomModalData>(ModalTypes.changeRoom, {
        offeringId: match.params.offeringId,
        onConfirm: handleContinueSeating,
      })
    }
  }

  return (
    <Container>
      <div className="left">
        <ActionBarInfoColumn>
          <>
            <h5>Name</h5>
            <p>
              {room.name
                ? room.name
                : '(Untitled room)'}
              <IconButton
                icon={['far', 'pencil']}
                handler={handleEditName}
                iconSize={0}
                iconColor={theme.red}
              />
            </p>
            <h5>Total Room Capacity</h5>
            <p>{currentSeats && Object.keys(currentSeats).length}</p>
          </>
        </ActionBarInfoColumn>
      </div>

      <div className="right">
        <ActionBarButton
          text="New Table"
          icon={['far', 'plus-circle']}
          handler={handleAddTable}
        />
        <ActionBarDivider />
        <div className="seat-size-slider">
          <div className="row">
            <div className="smaller" />
            <input
              type="range"
              min="30"
              max="115"
              step="3"
              defaultValue={`${room.seat_size}`}
              onChange={(e) => throttledSeatSlide(parseInt(e.target.value))}
            />
            <div className="larger" />
          </div>
          <p>Seat Size</p>
        </div>
        <ActionBarDivider />
        <ActionBarButton
          text="Print Blank Chart"
          icon={['far', 'print']}
          handler={handlePrint}
        />
        {isCustom && (
          <>
            <ActionBarDivider />
            <ActionBarButton
              text="Change Room"
              icon={['far', 'map-marker-alt']}
              handler={handleChangeRoom}
            />
            <TextButton
              text="Continue Seating"
              variant="red"
              clickHandler={handleContinueSeating}
              rightIcon={['far', 'long-arrow-right']}
              style={{ marginLeft: '3em' }}
            />
          </>
        )}
      </div>
    </Container>
  )
}

const mapState = (
  { rooms, seats }: AppState,
  { match }: RouteComponentProps<{ roomId: string }>,
) => ({
  room: rooms[match.params.roomId],
  seats,
})

export default connect(mapState, {
  setTask,
  loadTempTable,
  setChoosingPoint,
  updateRoom,
  initiatePrint,
  setModal,
})(RoomDefault)
