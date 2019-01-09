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
        ...action.offerings
      }
    case C.UPDATE_OFFERING:
      return {
        ...state,
        [action.offering_id]: {
          ...state[action.offering_id],
          [action.attribute]: action.value
        }
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
        ...action.students
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
              seat: action.seat_id
            }
          }
        }
      }
    case C.UPDATE_STUDENT:
      return {
        ...state,
        [action.student_id]: {
          ...state[action.student_id],
          [action.attribute]:action.value
        }
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
        ...action.rooms
      }
    case C.UPDATE_ROOM:
      return {
        ...state,
        [action.roomID]: {
          ...state[action.roomID],
          [action.key]: action.value
        }
      }
    case C.DELETE_ROOM:
      var newState = { ...state }
      delete newState[action.roomID]
      return newState
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
    case C.REMOVE_TABLE:
      var newState = { ...state }
      delete newState[action.tableID]
      return newState
    default:
      return state
  }
}

/**
 * entities / seats
 */
const seats = (state = { }, action) => {
  switch (action.type) {
    case C.RECEIVE_SEATS:
      // loop through the seats in the store for the incoming table
      // if the action's seat batch does not include this seat from the store, delete it
      // once we've cleared out the old seats, then set receive seats into store
      Object.keys(state).filter(seatId => state[seatId].table_id === action.tableId).forEach(seatId => {
        !Object.keys(action.seats).includes(seatId) ? delete state[seatId] : false
      })
      return {
        ...state,
        ...action.seats
      }
    case C.DELETE_SEATS:
      // we want to remove all the seats in state that have the provided table id
      Object.keys(state).forEach(seatId => {
        state[seatId].table_id === action.tableId ? delete state[seatId] : false
      })
      return state
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