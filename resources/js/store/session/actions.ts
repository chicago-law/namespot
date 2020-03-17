import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { CSSProperties } from 'react'
import {
  MARK_TERM_OFFERINGS_RECEIVED,
  SessionActionTypes,
  MARK_ROOM_TEMPLATES_RECEIVED,
  MARK_ROOM_TABLES_RECEIVED,
  MARK_OFFERING_STUDENTS_RECEIVED,
  Tasks,
  SET_TASK,
  SELECT_SEAT,
  SELECT_STUDENT,
  SELECT_TABLE,
  LOAD_TEMP_TABLE,
  UPDATE_TEMP_TABLE,
  SET_CHOOSING_POINT,
  REPORT_MEASUREMENTS,
  REPORT_SCROLL_POS,
  MeasuredElements,
  TempTable,
} from './types'
import { validateTempTable } from '../../utils/validateTempTable'
import { Table } from '../tables/types'
import { updateTable, createTable } from '../tables/actions'

export const setTask = (task: Tasks | null): SessionActionTypes => ({
  type: SET_TASK,
  task,
})

export const selectSeat = (seatId: string | null): SessionActionTypes => ({
  type: SELECT_SEAT,
  seatId,
})

export const selectStudent = (studentId: string | null): SessionActionTypes => ({
  type: SELECT_STUDENT,
  studentId,
})

export const selectTable = (tableId: string | null): SessionActionTypes => ({
  type: SELECT_TABLE,
  tableId,
})

export const loadTempTable = (table: TempTable | null): SessionActionTypes => ({
  type: LOAD_TEMP_TABLE,
  table,
})

export const updateTempTable = (update: Partial<TempTable>): SessionActionTypes => ({
  type: UPDATE_TEMP_TABLE,
  update,
})

export const setChoosingPoint = (pointType: 'start' | 'curve' | 'end' | null): SessionActionTypes => ({
  type: SET_CHOOSING_POINT,
  pointType,
})

export const markTermOfferingsReceived = (termCode: number): SessionActionTypes => ({
  type: MARK_TERM_OFFERINGS_RECEIVED,
  termCode,
})

export const markOfferingStudentsReceived = (offeringId: string): SessionActionTypes => ({
  type: MARK_OFFERING_STUDENTS_RECEIVED,
  offeringId,
})

export const markRoomTablesReceived = (roomId: string): SessionActionTypes => ({
  type: MARK_ROOM_TABLES_RECEIVED,
  roomId,
})

export const markRoomTemplatesReceived = (): SessionActionTypes => ({
  type: MARK_ROOM_TEMPLATES_RECEIVED,
})

export const reportMeasurements = (
  name: MeasuredElements,
  measurements: CSSProperties,
): SessionActionTypes => ({
  type: REPORT_MEASUREMENTS,
  name,
  measurements,
})

export const reportScrollPos = (pos: number): SessionActionTypes => ({
  type: REPORT_SCROLL_POS,
  pos,
})

export const measureElement = (
  name: MeasuredElements,
  el: HTMLElement,
) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  const measurements = {
    height: el.offsetHeight.toString(),
    width: el.offsetWidth.toString(),
  }
  dispatch(reportMeasurements(name, measurements))
}

export const saveTempTable = (
  tempTable: TempTable,
  successCallback?: () => void,
  errorCallback?: (errors: string[]) => void,
) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  const errors = validateTempTable(tempTable)
  if (!errors.length) {
    // Update or create new depending on if tempTable is new or not.
    // A brew new table is given an id of 'temp', instead of a real one
    // assigned by the database.
    if (tempTable.id !== 'temp') {
      // Safe to coerce temp to real table because it has no errors and it has an ID.
      dispatch(updateTable(tempTable.id, tempTable as Table))
    } else {
      dispatch(createTable(tempTable))
    }
    if (successCallback) successCallback()
  } else if (errorCallback) {
    errorCallback(errors)
  }
}
