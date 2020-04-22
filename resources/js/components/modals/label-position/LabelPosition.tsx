import React, { useState } from 'react'
import { connect } from 'react-redux'
import ModalControls from '../ModalControls'
import ModalHeader from '../ModalHeader'
import { updateTempTable } from '../../../store/session/actions'
import ModalContent from '../ModalContent'
import { AppState } from '../../../store'
import { SessionState } from '../../../store/session/types'

export interface LabelPositionModalData {
  tableId: string;
}
interface StoreProps {
  session: SessionState;
  updateTempTable: typeof updateTempTable;
}
interface OwnProps {
  modalData: LabelPositionModalData;
}

const LabelPosition = ({
  session, updateTempTable,
}: StoreProps & OwnProps) => {
  const [position, setPosition] = useState(session.tempTable && session.tempTable.label_position)

  function handleConfirm() {
    updateTempTable({
      label_position: position,
    })
  }

  return (
    <>
      <ModalHeader title="Change Label Position" />

      <ModalContent>
        <ul>
          <li>
            <label htmlFor="above">
              <input
                type="radio"
                name="position"
                id="above"
                value="above"
                checked={position === 'above'}
                onChange={() => setPosition('above')}
              />
              Above
            </label>
          </li>
          <li>
            <label htmlFor="below">
              <input
                type="radio"
                name="position"
                id="below"
                value="below"
                checked={position === 'below'}
                onChange={() => setPosition('below')}
              />
              Below (default)
            </label>
          </li>
          <li>
            <label htmlFor="left">
              <input
                type="radio"
                name="position"
                id="left"
                value="left"
                checked={position === 'left'}
                onChange={() => setPosition('left')}
              />
              Left
            </label>
          </li>
          <li>
            <label htmlFor="right">
              <input
                type="radio"
                name="position"
                id="right"
                value="right"
                checked={position === 'right'}
                onChange={() => setPosition('right')}
              />
              Right
            </label>
          </li>
        </ul>
      </ModalContent>

      <ModalControls
        confirmText="Select"
        handleConfirm={handleConfirm}
      />
    </>
  )
}

const mapState = ({ session }: AppState) => ({
  session,
})

export default connect(mapState, {
  updateTempTable,
})(LabelPosition)
