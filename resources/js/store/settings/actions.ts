import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { RECEIVE_SETTINGS, SettingsActionTypes, SettingsState } from './types'
import api from '../../utils/api'
import { setLoadingStatus } from '../loading/actions'
import { reportAxiosError } from '../errors/actions'

export const receiveSettings = (
  settings: Partial<SettingsState>,
): SettingsActionTypes => ({
  type: RECEIVE_SETTINGS,
  settings,
})

export const fetchSettings = () => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  dispatch(setLoadingStatus('settings', true))
  api.fetchSettings()
    .then(({ data }) => {
      dispatch(receiveSettings(data.settings))
      dispatch(setLoadingStatus('settings', false))
    })
    .catch((response) => dispatch(reportAxiosError(response)))
}

export const updateSettings = (
  updates: Partial<SettingsState>,
) => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  dispatch(receiveSettings(updates))
  api.updateSettings(updates)
    .then(({ data }) => {
      dispatch(receiveSettings(data.settings))
    })
    .catch((response) => dispatch(reportAxiosError(response)))
}
