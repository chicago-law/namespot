import { normalize } from 'normalizr'
import * as schema from './schema';
import C from '../constants';
import { rootUrl } from './index';
import { receiveStudents } from './students';
import { receiveRooms } from './rooms';
import { setLoadingStatus, findAndSetCurrentRoom } from './app';

/**
 * OFFERINGS!
 */

// load offerings into store
export function receiveOfferings(response) {
  return {
    type: C.RECEIVE_OFFERINGS,
    offerings: response.offerings
  }
}
// Fetch all offerings for a given term code
export function fetchOfferings(termCode) {
  return function (dispatch) {
    return axios.get(`${rootUrl}api/offerings/${termCode}`)
      .then(function (response) {
        const normalizedData = response.data.length ? normalize(response.data, schema.offeringListSchema) : null;
        dispatch(receiveOfferings(normalizedData.entities))
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

// update an offering's room ID
export function updateOfferingRoom(offering_id, room_id) {
  return {
    type: C.UPDATE_OFFERING_ROOM,
    offering_id, room_id
  }
}

// take an offering, duplicate its rooms and tables, and re-assign students
// to the new tables
export function customizeOfferingRoom(offeringID) {
  return (dispatch) => {

    // turn on loading
    dispatch(setLoadingStatus('rooms', true));
    dispatch(setLoadingStatus('students', true));

    // send out the request to make the new room
    axios.get(`${rootUrl}api/create-room-for/${offeringID}`)
    .then(response => {
      // then do an action to update the offering's room ID in the store (rather
      // than re-downloading all offerings to get the update)
      const newRoomID = response.data.newRoomID;
      dispatch(updateOfferingRoom(offeringID, newRoomID));

      // now re-download the rooms (to do: download only one room)
      axios.get(`${rootUrl}api/rooms`)
      .then(response => {
        // console.log(response);
        const normalizedData = normalize(response.data, schema.roomListSchema);
        dispatch(receiveRooms(normalizedData.entities));

        // once we know the rooms (including the new room) are in the store,
        // we need to set the current room to this
        dispatch(findAndSetCurrentRoom(newRoomID));

        // finally, turn off loading
        dispatch(setLoadingStatus('rooms', false));
      })
      .catch(response => console.log(response));

        // now re-download the students for this offering
        axios.get(`${rootUrl}api/enrollment/${offeringID}`)
        .then((response) => {
          // console.log(response);
          const normalizedData = normalize(response.data, schema.studentListSchema);
          dispatch(receiveStudents(normalizedData.entities))

          // turn off loading
          dispatch(setLoadingStatus('students', false));
        })
        .catch(response => console.log(response));
      })
      .catch(response => console.log(response));
  }
}