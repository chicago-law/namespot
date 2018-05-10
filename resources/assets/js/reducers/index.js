import { combineReducers } from 'redux'

const selectedOffering = (state = '', action) => {
  switch (action.type) {
    case 'ENTER_OFFERING':
      return action.id
    default:
      return state
  }
}

const entities = (state = { offerings: {}, students: {}, rooms: {} }, action) => {
  switch (action.type) {
    case 'REQUEST_OFFERINGS':
      return state
    case 'RECEIVE_OFFERINGS':
      return {
        ...state,
        offerings:action.offerings
      }
    case 'RECEIVE_STUDENTS':
      return {
        ...state,
        students:action.students
      }
    case 'RECEIVE_ROOMS':
      return {
        ...state,
        rooms:action.rooms
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  selectedOffering,
  entities
})

export default rootReducer