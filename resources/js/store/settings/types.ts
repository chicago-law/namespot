export interface SettingsState {
  academic_year: string | null;
  catalog_prefix: string | null;
  school_name: string | null;
}

export const RECEIVE_SETTINGS = 'RECEIVE_SETTINGS'
export interface ReceiveSettings {
  type: typeof RECEIVE_SETTINGS;
  settings: Partial<SettingsState>;
}

export type SettingsActionTypes = ReceiveSettings
