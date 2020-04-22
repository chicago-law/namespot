import {
  PrintingState,
  PrintingActionTypes,
  SET_IS_PRINTING,
  SET_SHOW_CURTAIN,
  SET_PRINTABLE_FORMAT,
  UPDATE_PRINT_PROGRESS,
} from './types'

const initialState: PrintingState = {
  isPrinting: false,
  showCurtain: false,
  format: null,
  progress: null,
  options: {},
}

const printing = (
  state: PrintingState = initialState,
  action: PrintingActionTypes,
): PrintingState => {
  switch (action.type) {
    case SET_IS_PRINTING:
      return {
        ...state,
        isPrinting: action.status,
      }
    case SET_SHOW_CURTAIN:
      return {
        ...state,
        showCurtain: action.status,
      }
    case SET_PRINTABLE_FORMAT:
      return {
        ...state,
        format: action.format,
        options: action.options,
      }
    case UPDATE_PRINT_PROGRESS:
      return {
        ...state,
        progress: action.progress,
      }
    default:
      return state
  }
}

export default printing
