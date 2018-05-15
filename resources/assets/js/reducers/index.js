import { combineReducers } from 'redux'

/**
 * OFFERINGS
 */
const selectedOffering = (state = '', action) => {
  switch (action.type) {
    case 'ENTER_OFFERING':
      return action.id
    default:
      return state
  }
}

/**
 * TABLES
 */
const newTable = (state = { choosing:null }, action) => {
  switch (action.type) {
    case 'SELECT_TABLE':
      return {
        ...state,
        id:action.tableID
      }
    case 'SELECT_POINT_TYPE':
      return {
        ...state,
        choosing:action.pointType
      }
    case 'SELECT_START_POINTS':
      return {
        ...state,
        coords: {
          ...state.coords,
          start:action.id
        }
      }
    case 'SELECT_END_POINTS':
      return {
        ...state,
        coords: {
          ...state.coords,
          end:action.id
        }
      }
    case 'SELECT_CURVE_POINTS':
      return {
        ...state,
        coords: {
          ...state.coords,
          curve:action.id
        }
      }
    default:
      return state
  }
}

/**
 * ENTITIES
 */
const entities = (state = { offerings: {}, students: {}, rooms: {}, tables: {} }, action) => {
  switch (action.type) {
    // offerings
    case 'REQUEST_OFFERINGS':
      return state
    case 'RECEIVE_OFFERINGS':
      return {
        ...state,
        offerings:action.offerings
      }
    // students
    case 'RECEIVE_STUDENTS':
      return {
        ...state,
        students:action.students
      }
    // rooms
    case 'RECEIVE_ROOMS':
      return {
        ...state,
        rooms:action.rooms
      }
    // tables
    case 'SAVE_TABLE':
      return {
        ...state,
        tables: {
          ...state.tables,
          [action.tableID]: {
            id:action.tableID,
            roomID:action.roomID,
            seatCount:action.seatCount,
            coords:{
              ...action.reformattedCoords
            }
          }
        }
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  selectedOffering,
  newTable,
  entities
})

export default rootReducer