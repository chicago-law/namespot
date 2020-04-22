import { RoomsState, RoomsActionTypes, RECEIVE_ROOMS, REMOVE_ROOM } from './types'

const rooms = (
  state: RoomsState = {},
  action: RoomsActionTypes,
): RoomsState => {
  switch (action.type) {
    case RECEIVE_ROOMS:
      return {
        ...state,
        ...action.rooms,
      }
    case REMOVE_ROOM: {
      const rooms = { ...state }
      delete rooms[action.roomId]
      return rooms
    }
    default:
      return state
  }
}

export default rooms
