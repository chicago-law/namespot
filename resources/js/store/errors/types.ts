export interface ErrorsState {
  [id: number]: string;
}

export const ADD_ERROR = 'ADD_ERROR'
export interface AddErrorAction {
  type: typeof ADD_ERROR;
  message: string;
  id: number;
}

export const REMOVE_ERROR = 'REMOVE_ERROR'
export interface RemoveErrorAction {
  type: typeof REMOVE_ERROR;
  id: number;
}

export type ErrorsActionTypes =
  | AddErrorAction
  | RemoveErrorAction
