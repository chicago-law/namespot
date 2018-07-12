import { combineReducers } from 'redux';
import C from '../constants';

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
      return action.room;
    case C.RESET_CURRENT_ROOM:
      return currentRoomDefault;
    default:
      return state;
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
  students: []
}
const currentOffering = (state = currentOfferingDefault, action) => {
  switch (action.type) {
    case C.SET_CURRENT_OFFERING:
      return action.offering;
    case C.RESET_CURRENT_OFFERING:
      return currentOfferingDefault;
    default:
      return state;
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
      return state;
  }
}

/**
 * App / tempTable
 */
const tempTable = (state = {}, action) => {
  switch (action.type) {
    case C.NEW_TABLE:
      return {
        id:'new',
        room_id:null,
        seatCount:0,
        coords:{}
      }
    case C.SELECT_TABLE:
      return {
        id:action.tableID,
        room_id:action.roomID,
        seatCount:action.seatCount,
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
    case C.SAVE_POINT_TO_TEMP_TABLE:
      return {
        ...state,
        coords: {
          ...state.coords,
          [action.pointType]:action.pointKey
        }
      }
    case C.CLEAR_TEMP_TABLE:
      return {};
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
      return state;
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
      return { };
    default:
      return state
  }
}

/**
 * app / loading
 */
const loading = (state = {
  rooms:false,
  tables:false,
  offerings:false,
  students:false
}, action) => {
  switch(action.type) {
    case C.SET_LOADING_STATUS:
      return {
        ...state,
        [action.loadingType]: action.status
      }
    default:
      return state;
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
      return state.filter(error => error.name != action.name);
    default:
      return state;
  }
}

/**
 * entities / offerings
 */
const offerings = (state = {}, action) => {
  switch (action.type) {
    case C.RECEIVE_OFFERINGS:
      return {
        ...state,
        ...action.offerings
      }
    // case C.UPDATE_OFFERING_ROOM:
    //   return {
    //     ...state,
    //     [action.offering_id]: {
    //       ...state[action.offering_id],
    //       'room_id':action.room_id
    //     }
    //   }
    case C.UPDATE_OFFERING:
      return {
        ...state,
        [action.offering_id]: {
          ...state[action.offering_id],
          [action.attribute]: action.value
        }
      }
    default:
      return state;
  }
}

/**
 * entities / students
 */
const students = (state = {}, action) => {
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
          seats: {
            ...state[action.student_id].seats,
            [action.offering_id]:action.seat_id
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
      return state;
  }
}

/**
 * entities / rooms
 */
const rooms = (state = {}, action) => {
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
    default:
      return state;
  }
}

/**
 * entities / tables
 */
const tables = (state = {}, action) => {
  switch (action.type) {
    case C.RECEIVE_TABLES:
      return action.tables;
    case C.REMOVE_TABLE:
      delete state[action.tableID];
      return state;
    default:
      return state;
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
    modals,
    loading,
    errors
    // flipPerspective,
  }),
  entities: combineReducers({
    students,
    offerings,
    rooms,
    tables
  })
})

export default rootReducer