import { combineReducers } from 'redux'
import C from '../constants'

/**
 * entities / offerings
 */
const offerings = (state = { }, action) => {
  switch (action.type) {
    case C.RECEIVE_OFFERINGS:
      return {
        ...state,
        ...action.offerings,
      }
    case C.UPDATE_OFFERING:
      return {
        ...state,
        [action.offering_id]: {
          ...state[action.offering_id],
          [action.attribute]: action.value,
        },
      }
    default:
      return state
  }
}

/**
 * entities / students
 */
const students = (state = { }, action) => {
  switch (action.type) {
    case C.RECEIVE_STUDENTS:
      return {
        ...state,
        ...action.students,
      }
    case C.SEAT_STUDENT:
      return {
        ...state,
        [action.student_id]: {
          ...state[action.student_id],
          enrollment: {
            ...state[action.student_id].enrollment,
            [action.offering_id]: {
              ...state[action.student_id].enrollment[action.offering_id],
              seat: action.seat_id,
            },
          },
        },
      }
    case C.UPDATE_STUDENT:
      return {
        ...state,
        [action.student_id]: {
          ...state[action.student_id],
          [action.attribute]: action.value,
        },
      }
    default:
      return state
  }
}

/**
 * entities / rooms
 */
const rooms = (state = { }, action) => {
  switch (action.type) {
    case C.RECEIVE_ROOMS:
      return {
        ...state,
        ...action.rooms,
      }
    case C.UPDATE_ROOM:
      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          [action.key]: action.value,
        },
      }
    case C.DELETE_ROOM: {
      const newState = { ...state }
      delete newState[action.roomId]
      return newState
    }
    default:
      return state
  }
}

/**
 * entities / tables
 */
const tables = (state = { }, action) => {
  switch (action.type) {
    case C.RECEIVE_TABLES:
      return action.tables
    case C.REMOVE_TABLE: {
      const newState = { ...state }
      delete newState[action.tableID]
      return newState
    }
    default:
      return state
  }
}

/**
 * entities / seats
 */
const seats = (state = { }, action) => {
  switch (action.type) {
    case C.RECEIVE_SEATS: {
      // loop through the seats in the store for the incoming table. If we find
      // any that belong to the same table that's coming in, but are not present
      // in this new batch, then delete them.
      const existingSeats = { ...state }
      Object.keys(existingSeats).filter(existingSeatId => existingSeats[existingSeatId].table_id === action.tableId).forEach((existingSeatId) => {
        if (!Object.keys(action.seats).includes(existingSeatId)) delete existingSeats[existingSeatId]
      })
      return {
        ...existingSeats,
        ...action.seats,
      }
    }
    case C.DELETE_SEATS: {
      // we want to remove all the seats in state that have the provided table id
      const filteredSeats = { ...state }
      Object.keys(filteredSeats).forEach((seatId) => {
        if (filteredSeats[seatId].table_id === action.tableId) delete filteredSeats[seatId]
      })
      return filteredSeats
    }
    default:
      return state
  }
}

const entities = combineReducers({
  students,
  offerings,
  rooms,
  tables,
  seats,
})

export default entities
