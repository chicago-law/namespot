import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import ModalControls from '../ModalControls'
import ModalHeader from '../ModalHeader'
import { deleteTable } from '../../../store/tables/actions'
import ModalContent from '../ModalContent'
import { dismissModal } from '../../../store/modal/actions'

export interface DeleteTableModalData {
  tableId: string;
  roomId: string;
  onConfirm: () => void;
}
interface Props {
  modalData: DeleteTableModalData;
}

const DeleteTable = ({
  modalData,
}: Props) => {
  const dispatch = useDispatch()
  const { tableId, roomId, onConfirm } = modalData
  const [loading, setLoading] = useState(false)

  function handleConfirm() {
    setLoading(true)
    dispatch(deleteTable(tableId, roomId, () => {
      // After deleting, fire the optional onConfirm.
      if (onConfirm) onConfirm()
      // Close the modal.
      setLoading(false)
      dispatch(dismissModal())
    }))
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
        deferDismissal
        showLoading={loading}
      />
    </>
  )
}

export default DeleteTable
