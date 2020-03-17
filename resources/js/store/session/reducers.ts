import {
  SessionState,
  SessionActionTypes,
  MARK_TERM_OFFERINGS_RECEIVED,
  MARK_ROOM_TEMPLATES_RECEIVED,
  MARK_ROOM_TABLES_RECEIVED,
  MARK_OFFERING_STUDENTS_RECEIVED,
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
} from './types'

export const initialState: SessionState = {
  task: null,
  selectedSeat: null,
  selectedStudent: null,
  selectedTable: null,
  tempTable: null,
  choosingPoint: null,
  termOfferingsReceived: [],
  offeringStudentsReceived: [],
  roomTablesReceived: [],
  roomTemplatesReceived: false,
  measuredElements: {
    [MeasuredElements.siteHeader]: null,
  },
  scrolledFromTop: window.pageYOffset,
}

const session = (
  state: SessionState = initialState,
  action: SessionActionTypes,
): SessionState => {
  switch (action.type) {
    case SET_TASK:
      return {
        ...state,
        task: action.task,
      }
    case SELECT_SEAT:
      return {
        ...state,
        selectedSeat: action.seatId,
      }
    case SELECT_STUDENT:
      return {
        ...state,
        selectedStudent: action.studentId,
      }
    case SELECT_TABLE:
      return {
        ...state,
        selectedTable: action.tableId,
      }
    case LOAD_TEMP_TABLE:
      return {
        ...state,
        tempTable: action.table,
      }
    case UPDATE_TEMP_TABLE:
      if (state.tempTable) {
        return {
          ...state,
          tempTable: {
            ...state.tempTable,
            ...action.update,
          },
        }
      }
      return state
    case SET_CHOOSING_POINT:
      return {
        ...state,
        choosingPoint: action.pointType,
      }
    case MARK_TERM_OFFERINGS_RECEIVED:
      return {
        ...state,
        termOfferingsReceived: [...state.termOfferingsReceived, action.termCode],
      }
    case MARK_OFFERING_STUDENTS_RECEIVED:
      return {
        ...state,
        offeringStudentsReceived: [...state.offeringStudentsReceived, action.offeringId],
      }
    case MARK_ROOM_TABLES_RECEIVED:
      return {
        ...state,
        roomTablesReceived: [...state.roomTablesReceived, action.roomId],
      }
    case MARK_ROOM_TEMPLATES_RECEIVED:
      return {
        ...state,
        roomTemplatesReceived: true,
      }
    case REPORT_MEASUREMENTS:
      return {
        ...state,
        measuredElements: {
          ...state.measuredElements,
          [action.name]: action.measurements,
        },
      }
    case REPORT_SCROLL_POS:
      return {
        ...state,
        scrolledFromTop: action.pos,
      }
    default:
      return state
  }
}

export default session
