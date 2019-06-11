import {
  SET_LOADING_STATUS,
} from './types'

export const setLoadingStatus = (name: string, status: boolean) => ({
  type: SET_LOADING_STATUS,
  name,
  status,
})
