import React from 'react'
import { connect } from 'react-redux'
import ModalControls from '../ModalControls'
import ModalHeader from '../ModalHeader'
import { deleteTable } from '../../../store/tables/actions'
import ModalContent from '../ModalContent'

export interface DeleteTableModalData {
  tableId: string;
  roomId: string;
  onConfirm: Function;
}
interface StoreProps {
  deleteTable: typeof deleteTable;
}
interface OwnProps {
  modalData: DeleteTableModalData;
}

const DeleteTable = ({
  deleteTable, modalData,
}: StoreProps & OwnProps) => {
  const { tableId, roomId, onConfirm } = modalData

  function handleConfirm() {
    deleteTable(tableId, roomId)
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

export default connect(null, {
  deleteTable,
})(DeleteTable)
