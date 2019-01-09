import { combineReducers } from 'redux'
import C from '../constants'

/**
 * Selected Term
 */
const selectedTerm = (state = '', action) => {
  switch (action.type) {
    case C.SET_SESSION_TERM:
      return action.termCode
    default:
      return state
  }
}

const storage = combineReducers({
  selectedTerm,
})

export default storage