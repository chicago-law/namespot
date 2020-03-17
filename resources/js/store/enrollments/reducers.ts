import { EnrollmentsState, EnrollmentsActionTypes, RECEIVE_ENROLLMENTS, UPDATE_ENROLLMENT, REMOVE_ENROLLMENT } from './types'

const enrollments = (
  state: EnrollmentsState = {},
  action: EnrollmentsActionTypes,
): EnrollmentsState => {
  switch (action.type) {
    case RECEIVE_ENROLLMENTS:
      return {
        ...state,
        ...action.enrollments,
      }
    case UPDATE_ENROLLMENT:
      return {
        ...state,
        [action.offeringId]: {
          ...state[action.offeringId],
          [action.studentId]: {
            ...state[action.offeringId][action.studentId],
            ...action.params,
          },
        },
      }
    case REMOVE_ENROLLMENT: {
      const enrollments = { ...state[action.offeringId] }
      delete enrollments[action.studentId]
      return {
        ...state,
        [action.offeringId]: enrollments,
      }
    }
    default:
      return state
  }
}

export default enrollments
