import {
  SET_LOADING_STATUS, LoadingActionTypes, LoadingState,
} from './types'

export const setLoadingStatus = (
  name: keyof LoadingState, status: boolean,
): LoadingActionTypes => ({
  type: SET_LOADING_STATUS,
  name,
  status,
})
