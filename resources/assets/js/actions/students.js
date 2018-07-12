import { normalize } from 'normalizr'
import * as schema from './schema';
import C from '../constants';
import { rootUrl } from './index';
import { setLoadingStatus, setCurrentSeatId, requestError } from './app';

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
    dispatch(setLoadingStatus('students',true));

    // make the call
    return axios.get(`${rootUrl}api/enrollment/${offering_id}`)

    .then(function (response) {
      // normalize data and load into state
      const normalizedData = normalize(response.data, schema.studentListSchema);
      dispatch(receiveStudents(normalizedData.entities.students))

      // reset the loading status
      dispatch(setLoadingStatus('students',false));
    })
    .catch(response => {
      dispatch(requestError('fetch-students', response.message));
      dispatch(setLoadingStatus('students',false));
    });
  }
}
// Get students, if need be.
export function requestStudents(offering_id) {
  // for now, we won't have any check on whether or not we already have
  // the students loaded. Just get the students for the given offeringID every
  // time. May add one here in the future...
  return (dispatch) => dispatch(fetchStudents(offering_id));
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
    dispatch(seatStudent(offering_id, student_id, seat_id));

    // clear out current seat
    dispatch(setCurrentSeatId(null));

    // also send update to DB
    axios.post(`${rootUrl}api/student/update/${student_id}`, {
      offering_id:offering_id,
      assigned_seat:seat_id
    })
    .catch(function(response) {
      dispatch(requestError('assign-seat',response.message));
    });
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
  return (dispatch) => {

    // update in the store
    dispatch(updateStudent(student_id, attribute, value));

    // send update to DB
    axios.post(`${rootUrl}api/student/update/${student_id}`, {
      [attribute]:value
    })
    .catch(response => dispatch(requestError('student-update',response.message)));
  }
}