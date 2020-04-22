import { TablesState, TablesActionTypes, RECEIVE_TABLES, REMOVE_TABLE } from './types'

const rooms = (
  state: TablesState = {},
  action: TablesActionTypes,
): TablesState => {
  switch (action.type) {
    case RECEIVE_TABLES:
      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          ...action.tables,
        },
      }
    case REMOVE_TABLE: {
      const tablesInRoom = { ...state[action.roomId] }
      Object.keys(tablesInRoom).forEach(tableId => {
        if (tableId === action.tableId) {
          delete tablesInRoom[tableId as keyof typeof tablesInRoom]
        }
      })
      return {
        ...state,
        [action.roomId]: tablesInRoom,
      }
    }
    default:
      return state
  }
}

export default rooms
