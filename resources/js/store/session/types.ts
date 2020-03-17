import { CSSProperties } from 'react'

export type Tasks = 'seat-student' | 'edit-table' | 'student-details' | 'choose-point';

export enum MeasuredElements {
  siteHeader = 'siteHeader',
}

export interface TempTable {
  id: string;
  room_id: string;
  sX: number | null;
  sY: number | null;
  eX: number | null;
  eY: number | null;
  qX: number | null;
  qY: number | null;
  seat_count: number;
  label_position: 'above' | 'below' | 'left' | 'right' | null;
}

export interface SessionState {
  task: Tasks | null;
  selectedSeat: string | null;
  selectedStudent: string | null;
  selectedTable: string | null;
  tempTable: TempTable | null;
  choosingPoint: 'start' | 'curve' | 'end' | null;
  termOfferingsReceived: number[];
  offeringStudentsReceived: string[];
  roomTablesReceived: string[];
  roomTemplatesReceived: boolean;
  measuredElements: {
    [key in MeasuredElements]: CSSProperties | null;
  };
  scrolledFromTop: number;
}

export const SET_TASK = 'SET_TASK'
export interface SetTask {
  type: typeof SET_TASK;
  task: Tasks | null;
}

export const SELECT_SEAT = 'SELECT_SEAT'
export interface SelectSeat {
  type: typeof SELECT_SEAT;
  seatId: string | null;
}

export const SELECT_STUDENT = 'SELECT_STUDENT'
export interface SelectStudent {
  type: typeof SELECT_STUDENT;
  studentId: string | null;
}

export const SELECT_TABLE = 'SELECT_TABLE'
export interface SelectTable {
  type: typeof SELECT_TABLE;
  tableId: string | null;
}

export const LOAD_TEMP_TABLE = 'LOAD_TEMP_TABLE'
export interface LoadTempTable {
  type: typeof LOAD_TEMP_TABLE;
  table: TempTable | null;
}

export const UPDATE_TEMP_TABLE = 'UPDATE_TEMP_TABLE'
export interface UpdateTempTable {
  type: typeof UPDATE_TEMP_TABLE;
  update: Partial<TempTable>;
}

export const SET_CHOOSING_POINT = 'SET_CHOOSING_POINT'
export interface SetChoosingPoint {
  type: typeof SET_CHOOSING_POINT;
  pointType: 'start' | 'curve' | 'end' | null;
}

export const MARK_TERM_OFFERINGS_RECEIVED = 'MARK_TERM_OFFERINGS_RECEIVED'
export interface MarkTermOfferingsReceived {
  type: typeof MARK_TERM_OFFERINGS_RECEIVED;
  termCode: number;
}

export const MARK_OFFERING_STUDENTS_RECEIVED = 'MARK_OFFERING_STUDENTS_RECEIVED'
export interface MarkOfferingStudentsReceived {
  type: typeof MARK_OFFERING_STUDENTS_RECEIVED;
  offeringId: string;
}

export const MARK_ROOM_TABLES_RECEIVED = 'MARK_ROOM_TABLES_RECEIVED'
export interface MarkRoomTablesReceived {
  type: typeof MARK_ROOM_TABLES_RECEIVED;
  roomId: string;
}

export const MARK_ROOM_TEMPLATES_RECEIVED = 'MARK_ROOM_TEMPLATES_RECEIVED'
export interface MarkRoomTemplatesReceived {
  type: typeof MARK_ROOM_TEMPLATES_RECEIVED;
}

export const REPORT_MEASUREMENTS = 'REPORT_MEASUREMENTS'
export interface ReportMeasurements {
  type: typeof REPORT_MEASUREMENTS;
  name: MeasuredElements;
  measurements: CSSProperties;
}

export const REPORT_SCROLL_POS = 'REPORT_SCROLL_POS'
export interface ReportScrollPos {
  type: typeof REPORT_SCROLL_POS;
  pos: number;
}

export type SessionActionTypes =
  | SetTask
  | SelectSeat
  | SelectStudent
  | SelectTable
  | LoadTempTable
  | UpdateTempTable
  | SetChoosingPoint
  | MarkTermOfferingsReceived
  | MarkOfferingStudentsReceived
  | MarkRoomTemplatesReceived
  | MarkRoomTablesReceived
  | ReportMeasurements
  | ReportScrollPos
