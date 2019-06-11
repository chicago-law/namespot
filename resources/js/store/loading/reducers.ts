import {
  LoadingState,
  LoadingActionTypes,
  SET_LOADING_STATUS,
} from './types'

export const initialState: LoadingState = {}

const loading = (
  state: LoadingState = initialState,
  action: LoadingActionTypes,
): LoadingState => {
  switch (action.type) {
    case SET_LOADING_STATUS:
      return {
        ...state,
        [action.name]: action.status,
      }
    default:
      return state
  }
}

export default loading
