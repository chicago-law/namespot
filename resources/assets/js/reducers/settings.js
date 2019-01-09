import C from '../constants'

const settings = (state = {}, action) => {
  switch (action.type) {
    case C.RECEIVE_SETTINGS:
      return action.settings
    default:
      return state
  }
}

export default settings
