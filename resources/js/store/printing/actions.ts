import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { AppState } from '..'
import {
  SET_IS_PRINTING,
  PrintingActionTypes,
  SET_SHOW_CURTAIN,
  PrintableFormats,
  SET_PRINTABLE_FORMAT,
  PrintingOptions,
  UPDATE_PRINT_PROGRESS,
} from './types'

export const setIsPrinting = (
  status: boolean,
): PrintingActionTypes => ({
  type: SET_IS_PRINTING,
  status,
})

export const setShowCurtain = (
  status: boolean,
): PrintingActionTypes => ({
  type: SET_SHOW_CURTAIN,
  status,
})

export const setPrintingFormat = (
  format: PrintableFormats | null,
  options: PrintingOptions,
): PrintingActionTypes => ({
  type: SET_PRINTABLE_FORMAT,
  format,
  options,
})

export const updatePrintProgress = (
  progress: string | null,
): PrintingActionTypes => ({
  type: UPDATE_PRINT_PROGRESS,
  progress,
})

export const initiatePrint = (
  format: PrintableFormats,
  options: PrintingOptions = {},
) => (
  dispatch: ThunkDispatch<AppState, {}, AnyAction>,
) => {
  dispatch(setShowCurtain(true))
  dispatch(setPrintingFormat(format, options))
  setTimeout(() => {
    // Give it a second to dispatch.
    dispatch(setIsPrinting(true))
  }, 500)
}

export const exitPrint = () => (
  dispatch: ThunkDispatch<AppState, {}, AnyAction>,
) => {
  dispatch(setIsPrinting(false))
  dispatch(setPrintingFormat(null, {}))
  dispatch(updatePrintProgress(null))
  setTimeout(() => {
    dispatch(setShowCurtain(false))
  }, 50)
}
