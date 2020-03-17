import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { User, SET_AUTHED_USER, AuthedUserActionTypes } from './types'
import api from '../../utils/api'
import { reportAxiosError } from '../errors/actions'

export const setAuthedUser = (
  user: User | null,
): AuthedUserActionTypes => ({
  type: SET_AUTHED_USER,
  user,
})

export const getAuthedUser = () => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  api.getAuthedUser()
    .then(({ data }) => {
      dispatch(setAuthedUser(data))
    })
    .catch((response) => dispatch(reportAxiosError(response)))
}
