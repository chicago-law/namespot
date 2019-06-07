import C from '../constants'
import helpers from '../bootstrap'
import { setLoadingStatus, requestError } from './app'

export function receiveSettings(settings) {
  return {
    type: C.RECEIVE_SETTINGS,
    settings,
  }
}

export function requestSettings() {
  return (dispatch, getState) => {
    // Should be safe to test whether or not we need to fetch just based on
    // if there's anything in Settings or not.
    if (!Object.keys(getState().settings).length) {
      dispatch(setLoadingStatus('settings', true))
      axios.get(`${helpers.rootUrl}api/settings`)
        .then(({ data }) => {
          dispatch(receiveSettings(data))
          dispatch(setLoadingStatus('settings', false))
        })
        .catch((res) => {
          dispatch(requestError('fetch-settings', res.message))
          dispatch(setLoadingStatus('settings', false))
        })
    }
  }
}
