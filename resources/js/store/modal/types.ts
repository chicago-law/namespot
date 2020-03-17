export enum ModalTypes {
  labelPosition = 'labelPosition',
  deleteTable = 'deleteTable',
  changeRoom = 'changeRoom',
  deleteRoom = 'deleteRoom',
  editTextInput = 'editTextInput',
  editSelect = 'editSelect',
  printOffering = 'printOffering',
  addStudent = 'addStudent',
  changePicture = 'changePicture',
  editOffering = 'editOffering',
}

export interface Modal {
  show: boolean;
  modalType: ModalTypes | null;
  data: {};
}

export type ModalState = Modal;

export const SET_MODAL = 'SET_MODAL'
export interface SetModal {
  type: typeof SET_MODAL;
  modalType: ModalTypes;
  data: {};
}

export const HIDE_MODAL_CONTENT = 'HIDE_MODAL_CONTENT'
export interface HideModalContent {
  type: typeof HIDE_MODAL_CONTENT;
}

export const CLEAR_MODAL_DATA = 'CLEAR_MODAL_DATA'
export interface ClearModal {
  type: typeof CLEAR_MODAL_DATA;
}

export type ModalActionTypes =
  | SetModal
  | HideModalContent
  | ClearModal;
