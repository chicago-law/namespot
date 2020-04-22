import { ErrorsState, ErrorsActionTypes, ADD_ERROR, REMOVE_ERROR } from './types'

const errorsInitialState: ErrorsState = {}

const toasts = (
  state: ErrorsState = errorsInitialState,
  action: ErrorsActionTypes,
) => {
  switch (action.type) {
    case ADD_ERROR:
      return {
        ...state,
        [action.id]: action.message,
      }
    case REMOVE_ERROR: {
      const errors = { ...state }
      delete errors[action.id]
      return errors
    }
    default:
      return state
  }
}

export default toasts
