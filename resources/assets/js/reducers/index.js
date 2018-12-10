import { combineReducers } from 'redux'
import C from '../constants'
import helpers from '../bootstrap'

/**
 * App / view
 */
const view = (state = null, action) => {
  switch (action.type) {
    case C.SET_VIEW:
      return action.view
    default:
      return state
  }
}

/**
 * app / currentRoom
 */
const currentRoomDefault = {
  id: null,
  name: null,
  seat_size: null
}
const currentRoom = (state = currentRoomDefault, action) => {
  switch (action.type) {
    case C.SET_CURRENT_ROOM:
      return action.room
    case C.RESET_CURRENT_ROOM:
      return currentRoomDefault
    default:
      return state
  }
}

/**
 * app / currentSeatId
 */
const currentSeatId = (state = null, action) => {
  switch (action.type) {
    case C.SET_CURRENT_SEAT:
      return action.seatID
    default:
      return state
  }
}

/**
 * app / currentStudentId
 */
const currentStudentId = (state = null, action) => {
  switch (action.type) {
    case C.SET_CURRENT_STUDENT:
      return action.studentID
    default:
      return state
  }
}

/**
 * app / currentOffering
 */
const currentOfferingDefault = {
  catalog_nbr: null,
  id: null,
  instructors: [],
  name: null,
  room_id: null,
  term_code:null,
  students: [],
  paperSize: 'tabloid',
  flipped: false,
  namesToShow: 'first_and_last',
  useNicknames: true
}
const currentOffering = (state = currentOfferingDefault, action) => {
  switch (action.type) {
    case C.SET_CURRENT_OFFERING:
      return action.offering
    case C.RESET_CURRENT_OFFERING:
      return currentOfferingDefault
    default:
      return state
  }
}


/**
 * App / task
 */
const task = (state = '', action) => {
  switch (action.type) {
    case C.SET_TASK:
      return action.task
    default:
      return state
  }
}

/**
 * App / tempTable
 */
const tempTable = (state = { }, action) => {
  switch (action.type) {
    case C.NEW_TABLE:
      return {
        id:'new',
        room_id:null,
        seatCount:0,
        coords:{},
        labelPosition:'below'
      }
    case C.SELECT_TABLE:
      return {
        id:action.tableID,
        room_id:action.roomID,
        seatCount:action.seatCount,
        labelPosition:action.labelPosition,
        coords:{
          'start':action.coords.start,
          'end':action.coords.end,
          'curve':action.coords.curve,
        }
      }
    case C.SET_SEAT_COUNT:
      return {
        ...state,
        seatCount: action.seatCount
      }
    case C.SET_LABEL_POSITION:
      return {
        ...state,
        labelPosition: action.labelPosition
      }
    case C.SAVE_POINT_TO_TEMP_TABLE:
      return {
        ...state,
        coords: {
          ...state.coords,
          [action.pointType]:action.pointKey
        }
      }
    case C.CLEAR_TEMP_TABLE:
      return {}
    default:
      return state
  }
}

/**
 * App / pointSelection
 */
const pointSelection = (state = null, action) => {
  switch (action.type) {
    case C.SET_POINT_SELECTION:
      return action.pointType
    default:
      return state
  }
}

/**
 * App / Years
 * The general idea that is that we hard code in the first year that the system
 * is being used. Then we get the current academic year from a DB setting, updatable
 * by site admins. We'll also have a "future" value that decides how far ahead
 * to show from the current academic year.
 *
 * So whenever you need to list out all the years we (might) have data for, you start
 * from startYear, go through academicYear, plus whatever yearSpread is.
 *
 * App was launched in 2018 for UChicago Law, so it's set to 2018 here.
 * Change as needed.
 */

// App / years / initial
const initialYear = (state = 2017, action) => {
  switch(action.type) {
    default:
      return state
  }
}
// App / years / currentAcademic
// Always the FIRST of the two years. So 2018-2019 would be stored as 2018.
// Gets its default from helpers, which gets it from #root div
const academicYear = (state = helpers.academicYear, action) => {
  switch(action.type) {
    case C.SET_ACADEMIC_YEAR:
      return action.year
    default:
      return state
  }
}
// App / years / future
const futureYears = (state = 1, action) => {
  switch(action.type) {
    default:
      return state
  }
}

/**
 * app / modals
 */
const modals = (state = { }, action) => {
  switch (action.type) {
    case C.SET_MODAL:
      return {
        ...state,
        [action.modal]:action.status
      }
    case C.CLEAR_MODALS:
      return { }
    default:
      return state
  }
}

/**
 * app / loading
 */
const loading = (state = {}, action) => {
  switch(action.type) {
    case C.SET_LOADING_STATUS:
      return {
        ...state,
        [action.loadingType]: action.status
      }
    default:
      return state
  }
}

/**
 * app / errors
 */
const errors = ( state = [], action) => {
  switch (action.type) {
    case C.ADD_ERROR:
      return [
        ...state,
        {
          name:action.name,
          message:action.message
        }
      ]
    case C.REMOVE_ERROR:
      return state.filter(error => error.name != action.name)
    default:
      return state
  }
}

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

/**
 * storage
 */
const selectedTerm = (state = '', action) => {
  switch (action.type) {
    case C.SET_SESSION_TERM:
      return action.termCode
    default:
      return state
  }
}

/**
 * authedUser
 */
const authedUser = (state = null, action) => {
  switch (action.type) {
    case C.RECEIVE_USER:
      return action.user
    default:
      return state
  }
}

/**
 * stale
 */
const stale = (state = [], action) => {
  switch (action.type) {
    case C.MARK_STALE: {
      if (!state.includes(action.entityType)) {
        return [...state, action.entityType]
      }
      return state
    }
    case C.MARK_NOT_STALE: {
      const newArray = [...state]
      const i = newArray.indexOf(action.entityType)
      if (i > -1) {
        newArray.splice(i, 1)
      }
      return newArray
    }
    default:
      return state
  }
}

/**
 * settings
 */
const settings = (state = {}, action) => {
  switch (action.type) {
    case C.RECEIVE_SETTINGS:
      return action.settings
    default:
      return state
  }
}

const rootReducer = combineReducers({
  app: combineReducers({
    view,
    task,
    currentRoom,
    currentOffering,
    currentSeatId,
    currentStudentId,
    tempTable,
    pointSelection,
    years: combineReducers({
      initialYear,
      academicYear,
      futureYears
    }),
    modals,
    loading,
    errors
  }),
  entities: combineReducers({
    students,
    offerings,
    rooms,
    tables,
    seats,
  }),
  storage: combineReducers({
    selectedTerm
  }),
  authedUser,
  stale,
  settings,
})

export default rootReducer