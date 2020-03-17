import {
  HIDE_MODAL_CONTENT, CLEAR_MODAL_DATA, ModalActionTypes, ModalState, SET_MODAL,
} from './types'

const modalInitialState: ModalState = {
  show: false,
  modalType: null,
  data: {},
}

const modal = (
  state: ModalState = modalInitialState,
  action: ModalActionTypes,
): ModalState => {
  switch (action.type) {
    case SET_MODAL:
      return {
        show: true,
        modalType: action.modalType,
        data: action.data,
      }
    case HIDE_MODAL_CONTENT:
      return {
        ...state,
        show: false,
      }
    case CLEAR_MODAL_DATA:
      return modalInitialState
    default:
      return state
  }
}

export default modal
