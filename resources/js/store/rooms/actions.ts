import { ThunkDispatch, ThunkAction } from 'redux-thunk'
import { AnyAction } from 'redux'
import { RECEIVE_ROOMS, RoomsActionTypes, Room, REMOVE_ROOM } from './types'
import api from '../../utils/api'
import { markRoomTemplatesReceived } from '../session/actions'
import { setLoadingStatus } from '../loading/actions'
import { AppState } from '..'
import { receiveOfferings } from '../offerings/actions'
import { receiveEnrollments } from '../enrollments/actions'
import { reportAxiosError } from '../errors/actions'

export const receiveRooms = (
  rooms: { [key: string]: Room },
): RoomsActionTypes => ({
  type: RECEIVE_ROOMS,
  rooms,
})

export const removeRoom = (
  roomId: string,
): RoomsActionTypes => ({
  type: REMOVE_ROOM,
  roomId,
})

/* Gets all the TEMPLATE rooms. Custom rooms are not returned in this. */
export const getAllRooms = () => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  dispatch(setLoadingStatus('rooms', true))
  api.fetchRooms()
    .then(({ data }) => {
      dispatch(receiveRooms(data.rooms))
      dispatch(markRoomTemplatesReceived())
      dispatch(setLoadingStatus('rooms', false))
    })
    .catch(response => dispatch(reportAxiosError(response)))
}

export const getRoomById = (
  roomId: string,
) => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  dispatch(setLoadingStatus('rooms', true))
  api.fetchRooms({ roomId })
    .then(({ data }) => {
      dispatch(receiveRooms(data.rooms))
      dispatch(setLoadingStatus('rooms', false))
    })
    .catch(response => dispatch(reportAxiosError(response)))
}

export const updateRoom = (
  roomId: string,
  updates: Partial<Room>,
  optimistic = true,
) => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => AppState,
) => {
  if (optimistic) {
    const prevRoom = getState().rooms[roomId]
    if (prevRoom) {
      const newRoom = { ...prevRoom, ...updates }
      dispatch(receiveRooms({ [roomId]: newRoom }))
    }
  } else {
    dispatch(setLoadingStatus('rooms', true))
  }
  api.updateRoom(roomId, updates)
    .then(({ data }) => {
      if (!optimistic) {
        dispatch(receiveRooms(data.rooms))
        dispatch(setLoadingStatus('rooms', false))
      }
    })
    .catch(response => dispatch(reportAxiosError(response)))
}

export const createRoom = (
  offeringId: string | null = null,
): ThunkAction<Promise<string>, AppState, {}, AnyAction> => async (
  dispatch: ThunkDispatch<AppState, {}, AnyAction>,
): Promise<string> => {
  dispatch(setLoadingStatus('rooms', true))
  dispatch(setLoadingStatus('enrollments', true))
  const { data } = await api.createRoom(offeringId)
  dispatch(receiveRooms(data.rooms))
  if (offeringId && data.offerings && data.enrollments) {
    dispatch(receiveOfferings(data.offerings))
    dispatch(receiveEnrollments(data.enrollments))
  }
  dispatch(setLoadingStatus('rooms', false))
  dispatch(setLoadingStatus('enrollments', false))
  // Return the ID of the newly created room.
  return Object.keys(data.rooms)[0]
}

export const deleteRoom = (
  roomId: string,
) => (
  dispatch: ThunkDispatch<AppState, {}, AnyAction>,
) => {
  dispatch(removeRoom(roomId))
  api.deleteRoom(roomId)
}
