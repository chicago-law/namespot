import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import {
  CLEAR_MODAL_DATA, ModalActionTypes, ModalTypes, SET_MODAL, HIDE_MODAL_CONTENT,
} from './types'
import C from '../../utils/constants'

export const setModal = <D>(
  modalType: ModalTypes,
  data: D,
): ModalActionTypes => ({
  type: SET_MODAL,
  modalType,
  data,
})

export const hideModalContent = (): ModalActionTypes => ({
  type: HIDE_MODAL_CONTENT,
})

export const clearModalData = (): ModalActionTypes => ({
  type: CLEAR_MODAL_DATA,
})

export const dismissModal = (): ThunkAction<void, {}, {}, AnyAction> => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  dispatch(hideModalContent())
  setTimeout(() => {
    dispatch(clearModalData())
  }, C.modalTransitionDuration)
}
