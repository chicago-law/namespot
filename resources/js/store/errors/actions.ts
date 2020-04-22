import { AnyAction } from 'redux'
import { ThunkDispatch, ThunkAction } from 'redux-thunk'
import { AxiosError } from 'axios'
import {
  ADD_ERROR,
  REMOVE_ERROR,
  ErrorsActionTypes,
} from './types'
import { LaravelHttpException } from '../../utils/api'

export const addError = (message: string): ErrorsActionTypes => ({
  type: ADD_ERROR,
  message,
  id: Date.now(),
})

export const removeError = (id: number): ErrorsActionTypes => ({
  type: REMOVE_ERROR,
  id,
})

export const reportAxiosError = (
  e: AxiosError<LaravelHttpException>,
): ThunkAction<void, {}, {}, AnyAction> => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  let errorMessage = '(no response)'
  if (e.response) {
    const { response } = e
    errorMessage = `${response.status}. ${response.statusText}.`
    if (response.data && response.data.message) errorMessage += ` ${e.response.data.message}`
    dispatch(addError(errorMessage))
  } else {
    dispatch(addError(errorMessage))
  }
}
