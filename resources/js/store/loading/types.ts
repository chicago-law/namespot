export type LoadingNames =
  | 'offerings'
  | 'enrollments'
  | 'rooms'
  | 'students'
  | 'tables'
  | 'settings'

export interface LoadingState {
  offerings?: boolean;
  enrollments?: boolean;
  rooms?: boolean;
  students?: boolean;
  tables?: boolean;
  settings?: boolean;
}

export const SET_LOADING_STATUS = 'SET_LOADING_STATUS'

export interface SetLoadingStatus {
  type: typeof SET_LOADING_STATUS;
  name: LoadingNames;
  status: boolean;
}

export type LoadingActionTypes = SetLoadingStatus
