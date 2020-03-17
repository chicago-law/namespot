import React from 'react'
import { connect } from 'react-redux'
import ModalControls from '../ModalControls'
import ModalHeader from '../ModalHeader'
import { deleteRoom } from '../../../store/rooms/actions'
import ModalContent from '../ModalContent'

export interface DeleteRoomModalData {
  roomId: string;
}
interface StoreProps {
  deleteRoom: typeof deleteRoom;
}
interface OwnProps {
  modalData: DeleteRoomModalData;
}

const DeleteRoom = ({
  deleteRoom, modalData,
}: StoreProps & OwnProps) => {
  const { roomId } = modalData

  function handleConfirm() {
    deleteRoom(roomId)
  }

  return (
    <>
      <ModalHeader title="Delete Room?" />

      <ModalContent>
        <p>This will unseat anyone currently seated in this room. This action cannot be undone.</p>
      </ModalContent>

      <ModalControls
        confirmText="Yes, Delete Room"
        handleConfirm={handleConfirm}
      />
    </>
  )
}

export default connect(null, {
  deleteRoom,
})(DeleteRoom)
