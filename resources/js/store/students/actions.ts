import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { RECEIVE_STUDENTS, StudentsActionTypes, Student } from './types'
import api from '../../utils/api'
import { setLoadingStatus } from '../loading/actions'
import { AppState } from '..'
import { reportAxiosError } from '../errors/actions'

export const receiveStudents = (
  students: { [studentId: string]: Student },
): StudentsActionTypes => ({
  type: RECEIVE_STUDENTS,
  students,
})

export const getStudentsForOffering = (
  offeringId: string,
) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  dispatch(setLoadingStatus('students', true))
  api.fetchStudents({ offeringId })
    .then(({ data }) => {
      dispatch(receiveStudents(data.students))
      dispatch(setLoadingStatus('students', false))
    })
    .catch((response) => dispatch(reportAxiosError(response)))
}

export const getStudentsForRoster = (
  plan: string,
  term: string,
  callback?: () => void,
) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  api.fetchStudents({ plan, term })
    .then(({ data }) => {
      dispatch(receiveStudents(data.students))
      dispatch(setLoadingStatus('students', false))
      if (callback) callback()
    })
    .catch((response) => dispatch(reportAxiosError(response)))
}


export const updateStudent = (
  studentId: string,
  updates: Partial<Student>,
) => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
  getState: () => AppState,
) => {
  const updatedStudent = {
    ...getState().students[studentId],
    ...updates,
  }
  dispatch(receiveStudents({
    [studentId]: updatedStudent,
  }))
  api.updateStudent(studentId, updates)
    .catch((response) => dispatch(reportAxiosError(response)))
}
