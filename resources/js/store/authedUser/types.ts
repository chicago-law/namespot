export interface User {
  cnet_id: string;
  chicago_id: string;
  first_name: string;
  last_name: string;
  role: 'dev' | 'staff' | 'inst';
}

export type AuthedUserState = User | null

export const SET_AUTHED_USER = 'SET_AUTHED_USER'

export interface SetAuthedUser {
  type: typeof SET_AUTHED_USER;
  user: User | null;
}

export type AuthedUserActionTypes = SetAuthedUser
