/**
 * For room entities
 */

import { normalize } from 'normalizr'
import * as schema from './schema';
import C from '../constants';
import { rootUrl } from './index';

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

    // change the seat size in the store
    dispatch(setSeatSize(roomID, seatSize))

    // make the call to change it in the DB
    return axios.post(`${rootUrl}api/room/update/${roomID}`, {
      seat_size: seatSize
    })
      .then(function (response) {
        // console.log(response);
      });

  }
}