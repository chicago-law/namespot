export interface Table {
  id: string;
  room_id: string;
  sX: number;
  sY: number;
  eX: number;
  eY: number;
  qX: number | null;
  qY: number | null;
  seat_count: number;
  label_position: 'above' | 'below' | 'left' | 'right' | null;
}

export interface Tables {
  [tableId: string]: Table | undefined;
}

export interface TablesState {
  [roomId: string]: Tables | undefined;
}

export const RECEIVE_TABLES = 'RECEIVE_TABLES'
export interface ReceiveTables {
  type: typeof RECEIVE_TABLES;
  roomId: string;
  tables: {
    [tableId: string]: Table | undefined;
  };
}

export const REMOVE_TABLE = 'REMOVE_TABLE'
export interface RemoveTable {
  type: typeof REMOVE_TABLE;
  tableId: string;
  roomId: string;
}

export type TablesActionTypes =
  | ReceiveTables
  | RemoveTable;
