import React from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from '../../utils/styledComponents'
import { AppState } from '../../store/index'
import { ModalState, ModalTypes } from '../../store/modal/types'
import { dismissModal } from '../../store/modal/actions'
import C from '../../utils/constants'
import LabelPosition, { LabelPositionModalData } from './label-position'
import DeleteTable, { DeleteTableModalData } from './delete-table'
import ChangeRoom, { ChangeRoomModalData } from './change-room'
import DeleteRoom, { DeleteRoomModalData } from './delete-room'
import EditTextInput, { EditTextInputModalData } from './edit-text-input'
import PrintOffering, { PrintOfferingModalData } from './print-offering'
import AddStudent, { AddStudentModalData } from './add-student'
import ChangePicture, { ChangePictureModalData } from './change-picture'
import EditSelect, { EditSelectModalData } from './edit-select'
import CreateOffering, { EditOfferingModalData } from './edit-offering'

const Container = styled('div')<{ isActive: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${(props) => (props.isActive ? '999999' : '-1')};
  .shader {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0,0,0, .1);
  }
  .modal-window {
    position: absolute;
    top: 5vh;
    left: 5vh;
    right: 5vh;
    max-width: 60em;
    max-height: 90vh;
    overflow-y:auto;
    padding: 3em 3em 0 3em;
    background: white;
    margin: auto;
    box-shadow: 0 10px 25px rgba(0,0,0, .15);
  }
  .close-button {
    position: absolute;
    top: 0.5em;
    right: 0.5em;
    outline: none;
    border: none;
    width: 2.5em;
    height: 2.5em;
    border-radius: 100%;
    color: ${(props) => props.theme.middleGray};
    background: none;
    &:hover {
      background: ${(props) => props.theme.offWhite};
      color: ${(props) => props.theme.red};
    }
  }
`

interface StoreProps {
  modal: ModalState;
  dismissModal: typeof dismissModal;
}

const Modals = ({ dismissModal, modal }: StoreProps) => {
  // Stop any clicks from inside the modal ecosystem from bubbling up to
  // anything else.
  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
  }

  return (
    <Container isActive={modal.modalType !== null} onClick={handleClick}>
      <CSSTransition
        mountOnEnter
        in={modal.show}
        timeout={C.modalTransitionDuration}
        classNames="fade"
        unmountOnExit
      >
        <div className="shader" onClick={dismissModal} aria-hidden="true" />
      </CSSTransition>

      <CSSTransition
        mountOnEnter
        in={modal.show}
        timeout={C.modalTransitionDuration}
        classNames="slide-up-fade"
        unmountOnExit
      >
        <div className="modal-window" aria-modal="true" role="dialog">
          <button type="button" className="close-button" onClick={dismissModal}>
            <FontAwesomeIcon icon={['far', 'times']} title="Close Modal" />
          </button>
          {modal.modalType === ModalTypes.labelPosition && (
            <LabelPosition modalData={modal.data as LabelPositionModalData} />
          )}
          {modal.modalType === ModalTypes.deleteTable && (
            <DeleteTable modalData={modal.data as DeleteTableModalData} />
          )}
          {modal.modalType === ModalTypes.changeRoom && (
            <ChangeRoom modalData={modal.data as ChangeRoomModalData} />
          )}
          {modal.modalType === ModalTypes.deleteRoom && (
            <DeleteRoom modalData={modal.data as DeleteRoomModalData} />
          )}
          {modal.modalType === ModalTypes.editTextInput && (
            <EditTextInput modalData={modal.data as EditTextInputModalData} />
          )}
          {modal.modalType === ModalTypes.editSelect && (
            <EditSelect modalData={modal.data as EditSelectModalData} />
          )}
          {modal.modalType === ModalTypes.printOffering && (
            <PrintOffering modalData={modal.data as PrintOfferingModalData} />
          )}
          {modal.modalType === ModalTypes.addStudent && (
            <AddStudent modalData={modal.data as AddStudentModalData} />
          )}
          {modal.modalType === ModalTypes.changePicture && (
            <ChangePicture modalData={modal.data as ChangePictureModalData} />
          )}
          {modal.modalType === ModalTypes.editOffering && (
            <CreateOffering modalData={modal.data as EditOfferingModalData} />
          )}
        </div>
      </CSSTransition>
    </Container>
  )
}

const mapState = ({ modal }: AppState) => ({
  modal,
})

export default connect(mapState, {
  dismissModal,
})(Modals)
