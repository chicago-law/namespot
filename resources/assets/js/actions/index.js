import { normalize } from 'normalizr'
import * as schema from './schema'

const rootUrl = document.querySelector('body').dataset.root;

/**
 * OFFERINGS!
 */
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
// Fetch all offerings for a given term code
export function fetchOfferings(termCode) {

  return function (dispatch) {
    // tell app state that we started a request
    dispatch(requestOfferings);

    // now make the actual call
    return axios.get(`${rootUrl}api/offerings/${termCode}`)
      .then(function (response) {
        const normalizedData = normalize(response.data, schema.offeringListSchema);
        dispatch(receiveOfferings(normalizedData.entities))
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}


/**
 * EDITING TABLES!
 */
export function selectTable(tableID) {
  return {
    type:'SELECT_TABLE',
    tableID
  }
}
export function selectPointType(pointType) {
  return {
    type:'SELECT_POINT_TYPE',
    pointType
  }
}
export function selectPoints(id, pointType) {
  switch (pointType) {
    case 'start':
      return {
        type: 'SELECT_START_POINTS', id
      }
    case 'end':
      return {
        type: 'SELECT_END_POINTS', id
      }
    case 'curve':
      return {
        type: 'SELECT_CURVE_POINTS', id
      }
    default:
      return false
  }
}


/**
 * STUDENTS
 */
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


/**
 * ROOMS
 */
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
export function saveTable(tableID, roomID, coords, seatCount) {
  // currently coords just contains the blips' keys,
  // looks like this: start:"5_0", end:"17_1", etc.
  // we need to reformat it to actual coordinates
  let reformattedCoords = {};
  for (let coordType in coords) {
    if (coords.hasOwnProperty(coordType)) {
      const split = coords[coordType].split('_');
      switch (coordType) {
        case 'start':
          reformattedCoords = {
            ...reformattedCoords, sX:split[0], sY:split[1]
          }
          break;
        case 'end':
          reformattedCoords = {
            ...reformattedCoords, eX:split[0], eY:split[1]
          }
          break;
        case 'curve':
          reformattedCoords = {
            ...reformattedCoords, qX:split[0], qY:split[1]
          }
          break;
        default:
          return false;
      }
    }
  }
  return {
    type:'SAVE_TABLE',
    tableID,
    roomID,
    reformattedCoords,
    seatCount,
  }
}