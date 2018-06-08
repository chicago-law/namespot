/**
 * For room entities
 */

import { normalize } from 'normalizr'
import * as schema from './schema';
import C from '../constants';
import { rootUrl } from './index';
import { findAndSetCurrentRoom, setLoadingStatus } from './app';

/**
 * ROOMS
 */
// Load rooms into state
export function receiveRooms(response) {
  return {
    type: C.RECEIVE_ROOMS,
    rooms: response.rooms
  }
}
// Fetch all rooms
export function fetchRooms() {
  return function (dispatch) {

    // make the call
    return axios.get(`${rootUrl}api/rooms`)
      .then(function (response) {
        const normalizedData = normalize(response.data, schema.roomListSchema);
        dispatch(receiveRooms(normalizedData.entities))
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
export function setSeatSize(roomID, seatSize) {
  return {
    type: C.SET_SEAT_SIZE,
    roomID,
    seatSize
  }
}
export function setSeatSizeRequest(roomID, seatSize) {
  return (dispatch) => {

    // change the seat size in the room entity in store
    dispatch(setSeatSize(roomID, seatSize))

    // update store's currentRoom
    dispatch(findAndSetCurrentRoom(roomID));

    // finally, make a background call to change it in the DB
    return axios.post(`${rootUrl}api/room/update/${roomID}`, {
      seat_size: seatSize
    })
    .catch(function(response) {
      console.log(response);
    });
  }
}