import {
  SeatsState,
  SeatsActionTypes,
  RECEIVE_SEATS,
  RECEIVE_TABLE_SEATS,
  DELETE_TABLE_SEATS,
} from './types'

const seats = (
  state: SeatsState = {},
  action: SeatsActionTypes,
): SeatsState => {
  switch (action.type) {
    case RECEIVE_SEATS:
      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          ...action.seats,
        },
      }
    case RECEIVE_TABLE_SEATS: {
      // Delete existing seats at table before adding in our new ones.
      const currentSeatsInRoom = { ...state[action.roomId] }
      Object.keys(currentSeatsInRoom).forEach(seatId => {
        if (currentSeatsInRoom[seatId]?.tableId === action.tableId) {
          delete currentSeatsInRoom[seatId]
        }
      })
      return {
        ...state,
        [action.roomId]: {
          ...currentSeatsInRoom,
          ...action.seats,
        },
      }
    }
    case DELETE_TABLE_SEATS: {
      const seats = { ...state }
      Object.keys(seats).forEach(roomId => {
        const roomSeats = seats[roomId]
        if (roomSeats) {
          Object.keys(roomSeats).forEach(seatId => {
            const seat = roomSeats[seatId]
            if (seat && seat.tableId === action.tableId) {
              delete roomSeats[seatId]
            }
          })
        }
      })
      return seats
    }
    default:
      return state
  }
}

export default seats
