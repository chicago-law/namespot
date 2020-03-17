export type PrintableFormats =
  | 'seating-chart'
  | 'flash-cards'
  | 'name-tents'
  | 'roster';

export interface PrintingOptions {
  namesOnReverse?: boolean;
  allSeatsBlank?: boolean;
  aisOnly?: boolean;
  academicPlan?: string;
  gradTerm?: string;
}

export interface PrintingState {
  isPrinting: boolean;
  showCurtain: boolean;
  format: PrintableFormats | null;
  progress: string | null;
  options: PrintingOptions;
}

export const SET_IS_PRINTING = 'SET_IS_PRINTING'
export interface SetIsPrinting {
  type: typeof SET_IS_PRINTING;
  status: boolean;
}

export const SET_SHOW_CURTAIN = 'SET_SHOW_CURTAIN'
export interface SetShowCurtain {
  type: typeof SET_SHOW_CURTAIN;
  status: boolean;
}

export const SET_PRINTABLE_FORMAT = 'SET_PRINTABLE_FORMAT'
export interface SetPrintableFormat {
  type: typeof SET_PRINTABLE_FORMAT;
  format: PrintableFormats | null;
  options: PrintingOptions;
}

export const UPDATE_PRINT_PROGRESS = 'UPDATE_PRINT_PROGRESS'
export interface UpdatePrintProgress {
  type: typeof UPDATE_PRINT_PROGRESS;
  progress: string | null;
}

export type PrintingActionTypes =
  | SetIsPrinting
  | SetShowCurtain
  | SetPrintableFormat
  | UpdatePrintProgress;
