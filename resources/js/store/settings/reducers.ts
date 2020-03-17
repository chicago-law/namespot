import { SettingsState, SettingsActionTypes, RECEIVE_SETTINGS } from './types'

const initialState = {
  academic_year: null,
  catalog_prefix: null,
  school_name: null,
}

const settings = (
  state: SettingsState = initialState,
  action: SettingsActionTypes,
): SettingsState => {
  switch (action.type) {
    case RECEIVE_SETTINGS:
      return {
        ...state,
        ...action.settings,
      }
    default:
      return state
  }
}

export default settings
