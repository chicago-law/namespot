import { normalize } from 'normalizr'
import * as schema from './schema';
import C from '../constants';
import { rootUrl } from './index';

/**
 * STUDENTS
 */
export function receiveStudents(response) {
  return {
    type: C.RECEIVE_STUDENTS,
    students: response.students
  }
}
// Fetch all students for a given offering id
export function fetchStudents(offering_id) {
  return function (dispatch) {

    // make the call
    return axios.get(`${rootUrl}api/enrollment/${offering_id}`)
      .then(function (response) {
        const normalizedData = normalize(response.data, schema.studentListSchema);
        dispatch(receiveStudents(normalizedData.entities))
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}