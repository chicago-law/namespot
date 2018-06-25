import C from '../constants';

/**
 * view
 * 'edit-room','assign-seats','class-list','room-list','student-list'
 */
export function setView(view) {
  return {
    type: C.SET_VIEW,
    view
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
 * currentRoom
 */
export function findAndSetCurrentRoom(roomID) {
  return (dispatch, getState) => {
    if (getState().entities.rooms[roomID]) {
      dispatch(setCurrentRoom(getState().entities.rooms[roomID]));
    }
  }
}
export function setCurrentRoom(room) {
  return {
    type:C.SET_CURRENT_ROOM,
    room
  }
}
export function resetCurrentRoom() {
  return {
    type:C.RESET_CURRENT_ROOM
  }
}

/**
 * currentOffering
 */
export function findAndSetCurrentOffering(offeringID) {
  return (dispatch, getState) => {
    if (getState().entities.offerings[offeringID]) {
      dispatch(setCurrentOffering(getState().entities.offerings[offeringID]));
    }
  }
}
export function setCurrentOffering(offering) {
  return {
    type:C.SET_CURRENT_OFFERING,
    offering
  }
}
export function resetCurrentOffering() {
  return {
    type:C.RESET_CURRENT_OFFERING
  }
}

/**
 * currentSeatId
 */
export function setCurrentSeatId(seatID) {
  return {
    type:C.SET_CURRENT_SEAT,
    seatID
  }
}

/**
 * currentStudentId
 */
export function setCurrentStudentId(studentID) {
  return {
    type:C.SET_CURRENT_STUDENT,
    studentID
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
 * MODALS
 */
export function setModal(modal, status) {
  return {
    type:C.SET_MODAL,
    modal, status
  }
}

/**
 * LOADING
 */
export function setLoadingStatus(loadingType, status) {
  return {
    type:C.SET_LOADING_STATUS,
    loadingType,
    status
  }
}
