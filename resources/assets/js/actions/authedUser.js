import C from '../constants'
import helpers from '../bootstrap'
import { requestError } from './app'

export function receiveUser(user) {
  return {
    type: C.RECEIVE_USER,
    user
  }
}

export function fetchUser(id) {
  return (dispatch) => {
    axios.get(`${helpers.rootUrl}api/users/${id}`)
      .then(res => {
        dispatch(receiveUser(res.data))
      })
      .catch(res => {
        dispatch(requestError('auth', res.message))
      })
  }
}