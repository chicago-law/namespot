/**
 * For the App state
 */

import C from '../constants';
import { normalize } from 'normalizr'
import * as schema from './schema';
import { rootUrl } from './index';


/**
 * roomStatus
 * 'edit-table','seat-students'
 */
export function setRoomStatus(status) {
  return {
    type: C.SET_ROOM_STATUS,
    status
  }
}

/**
 * task
 * ’edit-room’,’edit-table’,’delete-table’,’lookup-student’,’student-details’,’edit-offering’
 */
export function setTask(task) {
  return {
    type:C.SET_TASK,
    task
  }
}

/**
 * TEMP TABLE
 */
// load a blank table into tempTable
export function newTable() {
  return {
    type: C.NEW_TABLE
  }
}
// load a table into tempTable into the store
export function selectTable(tableID, roomID, seatCount, coords) {
  return {
    type: C.SELECT_TABLE,
    tableID,
    roomID,
    seatCount,
    coords
  }
}
// set the seat count of tempTable
export function setSeatCount(seatCount) {
  return {
    type: C.SET_SEAT_COUNT,
    seatCount
  }
}
// save a point to the tempTable coords object
export function savePointToTempTable(pointKey, pointType) {
  return {
    type:C.SAVE_POINT_TO_TEMP_TABLE,
    pointKey,
    pointType
  }
}
// clear tempTable from the store
export function clearTempTable() {
  return {
    type: C.CLEAR_TEMP_TABLE
  }
}


/**
 * POINT SELECTION
 */
export function setPointSelection(pointType) {
  return {
    type: C.SET_POINT_SELECTION,
    pointType
  }
}

/**
 * ROOM LOADING
 */
export function setRoomLoadingStatus(status) {
  return {
    type:C.ROOM_LOADING,
    status
  }
}

