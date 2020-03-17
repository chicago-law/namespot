import { AuthedUserState, AuthedUserActionTypes, SET_AUTHED_USER } from './types'

const initialState = null

const authedUser = (
  state: AuthedUserState = initialState,
  action: AuthedUserActionTypes,
): AuthedUserState => {
  switch (action.type) {
    case SET_AUTHED_USER:
      return action.user
    default:
      return state
  }
}

export default authedUser
