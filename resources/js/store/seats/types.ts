export interface Seat {
  id: string;
  roomId: string;
  tableId: string;
  x: number;
  y: number;
  labelPosition: 'above' | 'below' | 'left' | 'right' | null;
}

export interface SeatsState {
  [roomId: string]: {
    [seatId: string]: Seat | undefined;
  } | undefined;
}

export const RECEIVE_SEATS = 'RECEIVE_SEATS'
export interface ReceiveSeats {
  type: typeof RECEIVE_SEATS;
  roomId: string;
  seats: {
    [seatId: string]: Seat | undefined;
  };
}

export const RECEIVE_TABLE_SEATS = 'RECEIVE_TABLE_SEATS'
export interface ReceiveTableSeats {
  type: typeof RECEIVE_TABLE_SEATS;
  roomId: string;
  tableId: string;
  seats: {
    [seatId: string]: Seat | undefined;
  };
}

export const DELETE_TABLE_SEATS = 'DELETE_TABLE_SEATS'
export interface DeleteTableSeats {
  type: typeof DELETE_TABLE_SEATS;
  tableId: string;
}

export type SeatsActionTypes =
  | ReceiveSeats
  | ReceiveTableSeats
  | DeleteTableSeats;
