import { normalize } from 'normalizr'
import * as schema from './schema'
import C from '../constants'
import helpers from '../bootstrap'
import { setLoadingStatus, requestError, findAndSetCurrentRoom } from './app'

/**
 * ACTION CREATORS
 */

export function receiveRooms(rooms) {
  return {
    type: C.RECEIVE_ROOMS,
    rooms,
  }
}

export function updateRoom(roomId, key, value) {
  return {
    type: C.UPDATE_ROOM,
    roomId,
    key,
    value,
  }
}

export function deleteRoom(roomId) {
  return {
    type: C.DELETE_ROOM,
    roomId,
  }
}

/**
 * THUNKS
 */

// Fetch all rooms
export function fetchRooms() {
  return (dispatch) => {
    // set loading state
    dispatch(setLoadingStatus('rooms', true))
    // make API call
    axios.get(`${helpers.rootUrl}api/rooms`)
    .then((response) => {
      const normalizedData = normalize(response.data, schema.roomListSchema)
      dispatch(receiveRooms(normalizedData.entities.rooms))
      dispatch(setLoadingStatus('rooms', false))
    })
    .catch((response) => {
      dispatch(setLoadingStatus('rooms', false))
      dispatch(requestError('room-fetch', response.message))
    })
  }
}

// Gently ask to hydrate with rooms, if we need them. Gets a room count from
// the DB and compares that to # of rooms in our store.
export function requestRooms() {
  return (dispatch, getState) => {
    dispatch(setLoadingStatus('rooms', true))
    axios.get(`${helpers.rootUrl}api/rooms/count`)
    .then((response) => {
      if (response.data > Object.keys(getState().entities.rooms).filter(id => getState().entities.rooms[id].type === 'template').length) {
        dispatch(fetchRooms())
      } else {
        dispatch(setLoadingStatus('rooms', false))
      }
    })
    .catch(() => {
      dispatch(requestError('rooms-fetch', 'Error getting room count from database', true))
      dispatch(fetchRooms())
    })
  }
}

// fetch a single room by its ID
export function fetchRoom(room_id) {
  return (dispatch) => {
    dispatch(setLoadingStatus('rooms', true))
    axios.get(`${helpers.rootUrl}api/room/${room_id}`)
    .then((response) => {
      const room = {
        [response.data.id]: {
          ...response.data,
        },
      }
      dispatch(receiveRooms(room))
      dispatch(setLoadingStatus('rooms', false))
    })
    .catch((response) => {
      dispatch(requestError('room-not-found', `Room not found! ${response.message}`))
      dispatch(setLoadingStatus('rooms', false))
    })
  }
}

// Check if a room is already in the store and fetch if not
export function requestRoom(room_id) {
  return (dispatch, getState) => {
    if (room_id != null && !getState().entities.rooms[room_id]) {
      dispatch(fetchRoom(room_id))
    }
  }
}

// update of room attribute, and sync w/ DB
export function requestRoomUpdate(roomId, key, value) {
  return (dispatch) => {
    // change the seat size in the room entity in store
    dispatch(updateRoom(roomId, key, value))

    // update the app's currentRoom in the store
    dispatch(findAndSetCurrentRoom(roomId))

    // finally, make a background call to change it in the DB
    axios.post(`${helpers.rootUrl}api/room/update/${roomId}`, {
      [key]: value,
    })
    .catch((response) => {
      dispatch(requestError('room-update', response.message))
    })
  }
}

// Delete a room
export function requestRoomDelete(roomId) {
  return (dispatch) => {
    // delete in store
    dispatch(deleteRoom(roomId))

    // delete in DB
    axios.delete(`${helpers.rootUrl}api/room/${roomId}`)
    .catch((res) => {
      dispatch(requestError('delete-room', `Error deleting room: ${res.message}`))
    })
  }
}
