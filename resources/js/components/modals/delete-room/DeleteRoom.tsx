import React from 'react'
import { useDispatch } from 'react-redux'
import ModalControls from '../ModalControls'
import ModalHeader from '../ModalHeader'
import ModalContent from '../ModalContent'
import { deleteRoom } from '../../../store/rooms/actions'

export interface DeleteRoomModalData {
  roomId: string;
}
interface OwnProps {
  modalData: DeleteRoomModalData;
}

const DeleteRoom = ({
  modalData,
}: OwnProps) => {
  const { roomId } = modalData
  const dispatch = useDispatch()

  function handleConfirm() {
    dispatch(deleteRoom(roomId))
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

export default DeleteRoom
