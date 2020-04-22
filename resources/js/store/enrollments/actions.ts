import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { RECEIVE_ENROLLMENTS, EnrollmentsActionTypes, Enrollment, UPDATE_ENROLLMENT, EnrollmentsState, REMOVE_ENROLLMENT, REMOVE_ALL_ENROLLMENTS } from './types'
import api from '../../utils/api'
import { setLoadingStatus } from '../loading/actions'
import { receiveStudents } from '../students/actions'
import { reportAxiosError } from '../errors/actions'

export const receiveEnrollments = (
  enrollments: EnrollmentsState,
): EnrollmentsActionTypes => ({
  type: RECEIVE_ENROLLMENTS,
  enrollments,
})

export const removeEnrollment = (
  offeringId: string,
  studentId: string,
): EnrollmentsActionTypes => ({
  type: REMOVE_ENROLLMENT,
  offeringId,
  studentId,
})

export const removeAllEnrollments = (): EnrollmentsActionTypes => ({
  type: REMOVE_ALL_ENROLLMENTS,
})

export const getEnrollments = (
  offeringId: string,
) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  dispatch(setLoadingStatus('enrollments', true))
  api.fetchEnrollments(offeringId)
    .then(({ data }) => {
      dispatch(receiveEnrollments(data.enrollments))
      dispatch(setLoadingStatus('enrollments', false))
    })
    .catch(response => dispatch(reportAxiosError(response)))
}

export const updateEnrollment = (
  offeringId: string,
  studentId: string,
  params: Partial<Enrollment> = {},
): EnrollmentsActionTypes => ({
  type: UPDATE_ENROLLMENT,
  offeringId,
  studentId,
  params,
})

export const assignSeat = (
  offeringId: string,
  studentId: string,
  seatId: string | null,
) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  dispatch(updateEnrollment(offeringId, studentId, { seat: seatId }))
  api.updateEnrollment(offeringId, studentId, { seat: seatId })
    .then(({ data }) => {
      // This has already been done optimistically, but we can do it again
      // just to make sure everything's in sync.
      dispatch(receiveEnrollments(data.enrollments))
    })
    .catch(response => dispatch(reportAxiosError(response)))
}

export const createEnrollment = (
  offeringId: string,
  studentId: string,
) => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  api.createEnrollment(offeringId, studentId)
    .then(({ data }) => {
      dispatch(receiveEnrollments(data.enrollments))
      dispatch(receiveStudents(data.students))
    })
    .catch(response => dispatch(reportAxiosError(response)))
}

export const deleteEnrollment = (
  offeringId: string,
  studentId: string,
) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  dispatch(removeEnrollment(offeringId, studentId))
  api.deleteEnrollment(offeringId, studentId)
    .catch(response => dispatch(reportAxiosError(response)))
}
