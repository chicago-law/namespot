import React from 'react'
import { useDispatch } from 'react-redux'
import ModalControls from '../ModalControls'
import ModalHeader from '../ModalHeader'
import { deleteTable } from '../../../store/tables/actions'
import ModalContent from '../ModalContent'

export interface DeleteTableModalData {
  tableId: string;
  roomId: string;
  onConfirm: Function;
}
interface Props {
  modalData: DeleteTableModalData;
}

const DeleteTable = ({
  modalData,
}: Props) => {
  const dispatch = useDispatch()
  const { tableId, roomId, onConfirm } = modalData

  function handleConfirm() {
    dispatch(deleteTable(tableId, roomId))
    if (onConfirm) onConfirm()
  }

  return (
    <>
      <ModalHeader title="Delete Table?" subtitle="This will unseat anyone currently seated at this table." />

      <ModalContent>
        <p>This action cannot be undone.</p>
      </ModalContent>

      <ModalControls
        confirmText="Yes, Delete"
        handleConfirm={handleConfirm}
      />
    </>
  )
}

export default DeleteTable
