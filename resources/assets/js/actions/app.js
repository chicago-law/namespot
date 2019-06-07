import C from '../constants'
import helpers from '../bootstrap'

/**
 * Record the height of the banner in state.
 * @param {number} height the height of the banner
 */
export const setBannerHeight = height => ({
  type: C.SET_BANNER_HEIGHT,
  height,
})

/**
 * view
 * 'edit-room','assign-seats','class-list','room-list','student-list'
 */
export function setView(view) {
  return {
    type: C.SET_VIEW,
    view,
  }
}


/**
 * task
 * ’edit-room’,’edit-table’,’delete-table’,’lookup-student’,’student-details’,’edit-offering’
 */
export function setTask(task) {
  return {
    type: C.SET_TASK,
    task,
  }
}

/**
 * ERROR MESSAGES
 */
export function addError(name, message) {
  return {
    type: C.ADD_ERROR,
    name,
    message,
  }
}
export function removeError(name) {
  return {
    type: C.REMOVE_ERROR,
    name,
  }
}
// only add the error message if it isn't already in the errors array
export function requestError(name, message, shouldLeave) {
  return (dispatch, getState) => {
    let duplicate = false
    getState().app.errors.forEach((error) => {
      if (error.name === name) {
        duplicate = true
      }
    })
    if (!duplicate) {
      dispatch(addError(name, message))
      // remove the error message after 4 seconds if true is passed as third parameter
      if (shouldLeave) {
        window.setTimeout(() => {
          dispatch(removeError(name))
        }, 4000)
      }
    }
  }
}

/**
 * currentRoom
 */
// loads a room into store's app's currentRoom
export function setCurrentRoom(room) {
  return {
    type: C.SET_CURRENT_ROOM,
    room,
  }
}
export function resetCurrentRoom() {
  return {
    type: C.RESET_CURRENT_ROOM,
  }
}
export function findAndSetCurrentRoom(roomId) {
  return (dispatch, getState) => {
    if (getState().entities.rooms[roomId]) {
      dispatch(setCurrentRoom(getState().entities.rooms[roomId]))
    }
  }
}

/**
 * currentOffering
 */
export function setCurrentOffering(offering) {
  return {
    type: C.SET_CURRENT_OFFERING,
    offering,
  }
}
export function resetCurrentOffering() {
  return {
    type: C.RESET_CURRENT_OFFERING,
  }
}
export function findAndSetCurrentOffering(offeringId) {
  return (dispatch, getState) => {
    if (getState().entities.offerings[offeringId]) {
      dispatch(setCurrentOffering(getState().entities.offerings[offeringId]))
    }
  }
}

/**
 * currentSeatId
 */
export function setCurrentSeatId(seatID) {
  return {
    type: C.SET_CURRENT_SEAT,
    seatID,
  }
}

/**
 * currentStudentId
 */
export function setCurrentStudentId(studentID) {
  return {
    type: C.SET_CURRENT_STUDENT,
    studentID,
  }
}


/**
 * TEMP TABLE
 */
// load a blank table into tempTable
export function newTable() {
  return {
    type: C.NEW_TABLE,
  }
}
// load an existing table into tempTable in the store
export function selectTable(tableID, roomId, seatCount, labelPosition, coords) {
  return {
    type: C.SELECT_TABLE,
    tableID,
    roomId,
    seatCount,
    labelPosition,
    coords,
  }
}
// set the seat count of tempTable
export function setSeatCount(seatCount) {
  return {
    type: C.SET_SEAT_COUNT,
    seatCount,
  }
}
// set the label position of tempTable
export function setLabelPosition(labelPosition) {
  return {
    type: C.SET_LABEL_POSITION,
    labelPosition,
  }
}
// save a point to the tempTable coords object
export function savePointToTempTable(pointKey, pointType) {
  return {
    type: C.SAVE_POINT_TO_TEMP_TABLE,
    pointKey,
    pointType,
  }
}
// clear tempTable from the store
export function clearTempTable() {
  return {
    type: C.CLEAR_TEMP_TABLE,
  }
}


/**
 * POINT SELECTION
 */
export function setPointSelection(pointType) {
  return {
    type: C.SET_POINT_SELECTION,
    pointType,
  }
}

/**
 * ACADEMIC YEAR (always the FIRST of the two years. So academic year 2018-2019
 * would be stored as 2018)
 */
export function setAcademicYear(year) {
  return {
    type: C.SET_ACADEMIC_YEAR,
    year,
  }
}
export function requestAcademicYearChange(year) {
  return ((dispatch) => {
    // update in DB
    axios.post(`${helpers.rootUrl}api/settings/update`, {
      setting_name: 'academic_year',
      setting_value: year,
    })
    .then(() => {
      // if successful, update in the store
      dispatch(setAcademicYear(year))
    })
    .catch((response) => {
      dispatch(requestError('settings-update', response.message))
    })
  })
}
export function fetchAcademicYear() {
  return ((dispatch) => {
    const year = helpers.academicYear
    dispatch(setAcademicYear(parseInt(year)))
  })
}

/**
 * MODALS
 */
export function setModal(modal, status) {
  return {
    type: C.SET_MODAL,
    modal,
status,
  }
}
export function clearModals() {
  return {
    type: C.CLEAR_MODALS,
  }
}

/**
 * LOADING
 */
export function setLoadingStatus(loadingType, status) {
  return {
    type: C.SET_LOADING_STATUS,
    loadingType,
status,
  }
}
