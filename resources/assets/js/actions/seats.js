import C from '../constants'

/**
 * Add seats for a table in the store
 *
 * Note: Also deletes any existing seats attached to the table that don't
 * also exist in the action's new batch.
 */
export function receiveSeats(seats, tableId) {
  return {
    type: C.RECEIVE_SEATS,
    seats,
    tableId,
  }
}

/**
 * Delete a table's seats from the store
 */
export function deleteSeats(tableId) {
  return {
    type: C.DELETE_SEATS,
    tableId,
  }
}
