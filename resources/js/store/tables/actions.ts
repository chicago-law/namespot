import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { RECEIVE_TABLES, TablesActionTypes, Table, REMOVE_TABLE } from './types'
import api from '../../utils/api'
import { markRoomTablesReceived } from '../session/actions'
import { setLoadingStatus } from '../loading/actions'
import { TempTable } from '../session/types'
import { deleteTableSeats } from '../seats/actions'
import { reportAxiosError } from '../errors/actions'

export const receiveTables = (
  roomId: string,
  tables: { [tableId: string]: Table },
): TablesActionTypes => ({
  type: RECEIVE_TABLES,
  roomId,
  tables,
})

export const removeTable = (
  tableId: string,
  roomId: string,
): TablesActionTypes => ({
  type: REMOVE_TABLE,
  tableId,
  roomId,
})

export const getTablesForRoom = (
  roomId: string,
) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  dispatch(setLoadingStatus('tables', true))
  api.fetchTables(roomId)
    .then(({ data }) => {
      dispatch(receiveTables(roomId, data.tables))
      dispatch(markRoomTablesReceived(roomId))
      dispatch(setLoadingStatus('tables', false))
    })
    .catch(response => dispatch(reportAxiosError(response)))
}

export const updateTable = (
  tableId: string,
  updates: Partial<Table>,
  callback?: () => void,
) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  dispatch(setLoadingStatus('tables', true))
  api.updateTable(tableId, updates)
    .then(({ data }) => {
      dispatch(setLoadingStatus('tables', false))
      // Receive tables wants the Room ID, so we'll grab
      // it from the first table that comes back. In theory
      // they should all be from the same room. Maybe one
      // day we'll make receiveTables smarter.
      dispatch(receiveTables(data.tables[Object.keys(data.tables)[0]].room_id, data.tables))
      if (callback) callback()
    })
    .catch(response => dispatch(reportAxiosError(response)))
}

export const createTable = (
  newTable: TempTable,
  callback?: () => void,
) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  dispatch(setLoadingStatus('tables', true))
  api.createTable(newTable)
    .then(({ data }) => {
      dispatch(setLoadingStatus('tables', false))
      dispatch(receiveTables(data.room_id, {
        [data.id]: data,
      }))
      if (callback) callback()
    })
    .catch(response => dispatch(reportAxiosError(response)))
}

export const deleteTable = (
  tableId: string,
  roomId: string,
  callback?: () => void,
) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  dispatch(removeTable(tableId, roomId))
  dispatch(deleteTableSeats(tableId))
  api.deleteTable(tableId)
    .then(() => {
      if (callback) callback()
    })
    .catch(response => dispatch(reportAxiosError(response)))
}
