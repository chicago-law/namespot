export interface LoadingState {
  [name: string]: boolean;
}

export const SET_LOADING_STATUS = 'SET_LOADING_STATUS'

export interface SetLoadingStatus {
  type: typeof SET_LOADING_STATUS;
  name: string;
  status: boolean;
}

export type LoadingActionTypes = SetLoadingStatus
