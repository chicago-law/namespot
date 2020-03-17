import {
  SET_LOADING_STATUS, LoadingActionTypes, LoadingNames,
} from './types'

export const setLoadingStatus = (
  name: LoadingNames, status: boolean,
): LoadingActionTypes => ({
  type: SET_LOADING_STATUS,
  name,
  status,
})
