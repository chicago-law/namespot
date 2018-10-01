import { normalize } from 'normalizr'
import * as schema from './schema'
import queryString from 'query-string'
import C from '../constants'
import helpers from '../bootstrap'
import { setLoadingStatus, setCurrentSeatId, requestError } from './app'
import { requestUpdateOffering } from './offerings'

/**
 * STUDENTS
 */
// Load all students into the store
export function receiveStudents(students) {
  return {
    type: C.RECEIVE_STUDENTS,
    students
  }
}
// Fetch all students for a given offering id
export function fetchStudents(offering_id) {
  return function (dispatch) {
    // set loading status
    dispatch(setLoadingStatus('students',true))

    // make the call
    axios.get(`${helpers.rootUrl}api/enrollment/offering/${offering_id}`)
      .then(function (response) {
        // normalize data and load into state
        const normalizedData = normalize(response.data, schema.studentListSchema)
        dispatch(receiveStudents(normalizedData.entities.students))

        // reset the loading status
        dispatch(setLoadingStatus('students',false))
      })
      .catch(response => {
        dispatch(requestError('fetch-students', response.message))
        dispatch(setLoadingStatus('students',false))
      })
  }
}
// Get students by offering, if not already in store
export function requestStudents(offering_id) {
  // ok, for now, we won't have any check on whether or not we already have
  // the students loaded. Just get the students for the given offeringID every
  // time. May add one here in the future...
  return (dispatch) => dispatch(fetchStudents(offering_id))
}

// Get ALL students for a given term code. Also returns a count of the offerings
// from that term as well.
export function fetchAllStudentsFromTerm(termCode) {
  return dispatch => {

    // turn on loading for students
    dispatch(setLoadingStatus('students',true))

    // make the call
    axios.get(`${helpers.rootUrl}api/enrollment/term/${termCode}`)
      .then(response => {
        // normalize data and load into state
        const normalizedData = normalize(response.data, schema.studentListSchema)
        dispatch(receiveStudents(normalizedData.entities.students))

        // reset the loading status
        dispatch(setLoadingStatus('students',false))
      })
      .catch(response => {
        dispatch(requestError('fetch-students', response.message))
        dispatch(setLoadingStatus('students',false))
      })
  }
}

export function fetchStudentBody(params) {
  return (dispatch) => {
    // turn on student loading
    dispatch(setLoadingStatus('students', true))

    axios.get(`${helpers.rootUrl}api/enrollment/student-body?${queryString.stringify(params)}`)
    .then(({ data }) => {
      // load students into store
      const normalizedData = normalize(data.results, schema.studentListSchema)
      dispatch(receiveStudents(normalizedData.entities.students))

      // turn off student loading
      dispatch(setLoadingStatus('students',false))
    })
  }
}

// seat a student in the store's student entity
export function seatStudent(offering_id, student_id, seat_id) {
  return {
    type: C.SEAT_STUDENT,
    offering_id:'offering_' + offering_id,
    student_id,
    seat_id
  }
}
// assign a student to a seat - change it in the store, and save to DB
export function assignSeat(offering_id, student_id, seat_id) {
  return (dispatch) => {

    // update in the store
    dispatch(seatStudent(offering_id, student_id, seat_id))

    // clear out current seat
    dispatch(setCurrentSeatId(null))

    // also send update to DB
    axios.post(`${helpers.rootUrl}api/student/update/${student_id}`, {
      offering_id:offering_id,
      assigned_seat:seat_id
    })
    .catch(function(response) {
      dispatch(requestError('assign-seat',response.message))
    })
  }
}

// update a student's attribute in the store
export function updateStudent(student_id, attribute, value) {
  return {
    type: C.UPDATE_STUDENT,
    student_id, attribute, value
  }
}
// update a student and save it in the DB
export function updateAndSaveStudent(student_id, attribute, value) {
  return (dispatch, getState) => {

    // update in the store
    dispatch(updateStudent(student_id, attribute, value))

    // save to DB. include offering ID in case it's needed,
    // for example for is_namespot_addition.
    axios.post(`${helpers.rootUrl}api/student/update/${student_id}`, {
      [attribute]:value,
      offering_id: getState().app.currentOffering.id
    })
    .catch(response => dispatch(requestError('student-update',response.message)))
  }
}

export function unenrollStudent(studentId, offeringId) {
  return (dispatch, getState) => {

    // remove the offering in question from student's list of seats
    // (affects both store and in DB)
    const student = getState().entities.students[studentId]
    const enrollment = { ...student.enrollment}
    delete enrollment[`offering_${offeringId}`]
    dispatch(updateAndSaveStudent(studentId, 'enrollment', enrollment))

    // remove student from offering's student list
    // (affects both store and in DB)
    const offering = getState().entities.offerings[offeringId]
    const filteredStudents = offering.students.filter(id => id != studentId)
    dispatch(requestUpdateOffering(offeringId, 'students', filteredStudents))

    // finally, send a request to detach in the DB
    axios.post(`${helpers.rootUrl}api/student/unenroll`, {
      student_id: studentId,
      offering_id: offeringId
    })
    .catch(response => dispatch(requestError('unenroll-student',response.message)))
  }
}