import { normalize } from 'normalizr'
import * as schema from './schema';
import C from '../constants';
import { rootUrl } from './index';
import { findAndSetCurrentRoom, setLoadingStatus } from './app';

/**
 * ROOMS
 */

// Load rooms into state
export function receiveRooms(rooms) {
  return {
    type: C.RECEIVE_ROOMS,
    rooms: rooms
  }
}
// Fetch all rooms
export function fetchRooms() {
  return function (dispatch) {
    // set loading state
    dispatch(setLoadingStatus('rooms',true));
    // make API call
    axios.get(`${rootUrl}api/rooms`)
    .then(function (response) {
      const normalizedData = normalize(response.data, schema.roomListSchema);
      dispatch(receiveRooms(normalizedData.entities.rooms))
      dispatch(setLoadingStatus('rooms',false))
    })
    .catch(function (error) {
      console.log(error);
      dispatch(setLoadingStatus('rooms',false))
    });
  }
}
// Gently ask to hydrate with rooms, if we need them
export function requestRooms() {
  return (dispatch, getState) => Object.keys(getState().entities.rooms).length < 3 ? dispatch(fetchRooms()) : false;
}

// fetch a single room by its ID
export function fetchRoom(room_id) {
  return function (dispatch) {
    dispatch(setLoadingStatus('rooms',true))
    axios.get(`${rootUrl}api/room/${room_id}`)
    .then(response => {
      const room = {
        [response.data.id]: {
          ...response.data
        }
      }
      dispatch(receiveRooms(room));
      dispatch(setLoadingStatus('rooms',false))
    })
    .catch(response => {
      console.log(response);
      dispatch(setLoadingStatus('rooms',false))
    })
  }
}
// fetch a single room if we need it
export function requestRoom(room_id) {
  return (dispatch, getState) => {
    if (!getState().entities.rooms[room_id]) {
      dispatch(fetchRoom(room_id))
    }
  }
}


// set new seat size
export function setSeatSize(roomID, seatSize) {
  return {
    type: C.SET_SEAT_SIZE,
    roomID,
    seatSize
  }
}
// request change of seat size
export function setSeatSizeRequest(roomID, seatSize) {
  return (dispatch) => {

    // change the seat size in the room entity in store
    dispatch(setSeatSize(roomID, seatSize))

    // update store's currentRoom
    dispatch(findAndSetCurrentRoom(roomID));

    // finally, make a background call to change it in the DB
    axios.post(`${rootUrl}api/room/update/${roomID}`, {
      seat_size: seatSize
    })
    .catch(function(response) {
      console.log(response);
    });
  }
}