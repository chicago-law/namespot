import { StudentsState, StudentsActionTypes, RECEIVE_STUDENTS } from './types'

const students = (
  state: StudentsState = {},
  action: StudentsActionTypes,
): StudentsState => {
  switch (action.type) {
    case RECEIVE_STUDENTS:
      return {
        ...state,
        ...action.students,
      }
    default:
      return state
  }
}

export default students
