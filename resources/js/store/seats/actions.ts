import { RECEIVE_SEATS, SeatsActionTypes, Seat, RECEIVE_TABLE_SEATS, DELETE_TABLE_SEATS } from './types'

export const receiveSeats = (
  roomId: string,
  seats: { [seatId: string]: Seat },
): SeatsActionTypes => ({
  type: RECEIVE_SEATS,
  roomId,
  seats,
})

export const deleteTableSeats = (
  tableId: string,
): SeatsActionTypes => ({
  type: DELETE_TABLE_SEATS,
  tableId,
})

// Like receiveSeats, except we assume that the seats coming in is an exhaustive
// list of seats for the table, therefore you can first delete all current seats
// at the table.
export const receiveTableSeats = (
  roomId: string,
  tableId: string,
  seats: { [seatId: string]: Seat },
): SeatsActionTypes => ({
  type: RECEIVE_TABLE_SEATS,
  roomId,
  tableId,
  seats,
})
