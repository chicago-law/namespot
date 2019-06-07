import C from '../constants'
import helpers from '../bootstrap'
import { setLoadingStatus, requestError } from './app'

export function receiveUser(user) {
  return {
    type: C.RECEIVE_USER,
    user,
  }
}

export function fetchUser(id) {
  return (dispatch) => {
    dispatch(setLoadingStatus('authedUser', true))
    axios.get(`${helpers.rootUrl}api/users/${id}`)
    .then((res) => {
      dispatch(receiveUser(res.data))
      dispatch(setLoadingStatus('authedUser', false))
    })
    .catch((res) => {
      dispatch(requestError('auth', res.message))
      dispatch(setLoadingStatus('authedUser', false))
    })
  }
}
