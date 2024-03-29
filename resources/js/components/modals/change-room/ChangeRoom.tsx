import React, { useState, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import ModalControls from '../ModalControls'
import ModalHeader from '../ModalHeader'
import { updateOffering } from '../../../store/offerings/actions'
import ModalContent from '../ModalContent'
import { AppState } from '../../../store'
import { OfferingsState } from '../../../store/offerings/types'
import { RoomsState } from '../../../store/rooms/types'
import { getAllRooms } from '../../../store/rooms/actions'
import { SessionState } from '../../../store/session/types'

export interface ChangeRoomModalData {
  offeringId: string;
  onConfirm?: () => void;
}
interface StoreProps {
  offerings: OfferingsState;
  rooms: RoomsState;
  session: SessionState;
}
interface OwnProps {
  modalData: ChangeRoomModalData;
}

const ChangeRoom = ({
  offerings, rooms, session, modalData,
}: StoreProps & OwnProps) => {
  const dispatch = useDispatch()
  const { offeringId, onConfirm } = modalData
  const offering = offerings[offeringId]
  const [selectedRoom, selectRoom] = useState((offering && offering.room_id) || '')

  function handleConfirm() {
    dispatch(updateOffering(offeringId, {
      room_id: selectedRoom,
    }))
    if (onConfirm) onConfirm()
  }

  useEffect(() => {
    if (!session.roomTemplatesReceived) dispatch(getAllRooms())
  }, [dispatch, session.roomTemplatesReceived])

  return (
    <>
      <ModalHeader title="Select Room" />

      <ModalContent>
        <>
          <p>Change this class's room assignment to:</p>
          <select
            defaultValue={selectedRoom}
            onChange={e => selectRoom(e.target.value)}
          >
            <option value="">--</option>
            {Object.keys(rooms).map(roomId => {
              const room = rooms[roomId]
              if (room && room.type === 'template') {
                return (
                  <option key={roomId} value={roomId}>
                    {room.name || '(Untitled room)'}
                  </option>
                )
              }
              return false
            })}
          </select>
          <p>Please note that changing rooms will erase any seat assignments you've made in the class so far!</p>
        </>
      </ModalContent>

      <ModalControls
        confirmText="Change Room"
        handleConfirm={handleConfirm}
      />
    </>
  )
}

const mapState = ({ offerings, rooms, session }: AppState) => ({
  offerings,
  rooms,
  session,
})

export default connect(mapState)(ChangeRoom)
