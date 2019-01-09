import C from '../constants'

const authedUser = (state = null, action) => {
  switch (action.type) {
    case C.RECEIVE_USER:
      return action.user
    default:
      return state
  }
}

export default authedUser