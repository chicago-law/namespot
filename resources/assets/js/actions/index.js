import { normalize } from 'normalizr'
import * as schema from './schema'

const rootUrl = document.querySelector('body').dataset.root;

export function enterOffering(id) {
  return {
    type:'ENTER_OFFERING',
    id
  }
}

export function requestOfferings() {
  return {
    type:'REQUEST_OFFERINGS'
  }
}

export function receiveOfferings(response) {
  return {
    type:'RECEIVE_OFFERINGS',
    offerings:response.offerings
  }
}

export function receiveStudents(response) {
  return {
    type:'RECEIVE_STUDENTS',
    students:response.students
  }
}

export function receiveRooms(response) {
  return {
    type:'RECEIVE_ROOMS',
    rooms:response.rooms
  }
}

// Fetch all offerings for a given term code
export function fetchOfferings(termCode) {

  return function (dispatch) {
    // tell app state that we started a request
    dispatch(requestOfferings);

    // now make the actual call
    return axios.get(`${rootUrl}api/offerings/${termCode}`)
      .then(function(response) {
        const normalizedData = normalize(response.data, schema.offeringListSchema);
        dispatch(receiveOfferings(normalizedData.entities))
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}

// Fetch all students for a given offering id
export function fetchStudents(offering_id) {
  return function (dispatch) {

    // make the call
    return axios.get(`${rootUrl}api/enrollment/${offering_id}`)
      .then(function(response) {
        const normalizedData = normalize(response.data, schema.studentListSchema);
        dispatch(receiveStudents(normalizedData.entities))
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}

// Fetch all rooms
export function fetchRooms() {
  return function (dispatch) {

    // make the call
    return axios.get(`${rootUrl}api/rooms`)
      .then(function(response) {
        const normalizedData = normalize(response.data, schema.roomListSchema);
        dispatch(receiveRooms(normalizedData.entities))
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}