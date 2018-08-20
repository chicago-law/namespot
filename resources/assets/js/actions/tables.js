import { normalize } from 'normalizr'
import * as schema from './schema'
import helpers from '../bootstrap'
import C from '../constants'
import { clearTempTable, setLoadingStatus, requestError } from './app'
import { deleteSeats } from './seats'
/**
 * ENTITY TABLES
 */
// load tables into state
export function receiveTables(tables) {
  // loop through the tables. for each one, concat the coords into start, end, curve
  let formattedTables = {}
  Object.keys(tables).forEach(tableID => {
    formattedTables = {
      ...formattedTables,
      [tableID]: {
        ...tables[tableID],
        gridCoords: {
          'start': tables[tableID].sX + '_' + tables[tableID].sY,
          'end': tables[tableID].eX + '_' + tables[tableID].eY,
          'curve': tables[tableID].qX + '_' + tables[tableID].qY,
        }
      }
    }
  })
  return {
    type: C.RECEIVE_TABLES,
    tables:formattedTables
  }
}
// request and fetch the tables from DB for a room
export function fetchTables(roomID) {
  return (dispatch, getState) => {
    // Do we actually need to get the tables?
    // Test by checking if there are already tables belonging
    // to the room passed in.
    const tablesObj = getState().entities.tables
    const alreadyHave = Object.keys(tablesObj).some(tableID => (
      parseInt(tablesObj[tableID].room_id) === parseInt(roomID)
    ))
    if (!alreadyHave) {
      // set loading status
      dispatch(setLoadingStatus('tables',true))
      // make the call
      axios.get(`${helpers.rootUrl}api/tables/${roomID}`)
      .then(response => {
        if (response.data.length) { // if there were any tables to receive
          const normalizedData = normalize(response.data, schema.tableListSchema)
          dispatch(receiveTables(normalizedData.entities.tables))
        }
        dispatch(clearTempTable())
        dispatch(setLoadingStatus('tables',false))
      })
      .catch(response => {
        dispatch(requestError('fetch-tables',response.message))
        dispatch(setLoadingStatus('tables',false))
      })
    }
  }
}


// save a table to the DB, and then fetch new tables
export function saveNewTable(tableID, roomID, coords, seatCount, labelPosition) {
  return function (dispatch, getState) {

    // first change to loading status
    dispatch(setLoadingStatus('tables',true))

    // first we need to format the coords into the flat, DB-friendly format
    let formattedCoords = { sX: null, sY: null, eX: null, eY: null, qX: null, qY: null }
    for (let coordType in coords) {
      if (coords.hasOwnProperty(coordType) && coords[coordType] !== 'null_null' && coords[coordType] !== null) {
        const split = coords[coordType].split('_')
        switch (coordType) {
          case 'start':
            formattedCoords = {
              ...formattedCoords, sX: split[0], sY: split[1]
            }
            break
          case 'end':
            formattedCoords = {
              ...formattedCoords, eX: split[0], eY: split[1]
            }
            break
          case 'curve':
            formattedCoords = {
              ...formattedCoords, qX: split[0], qY: split[1]
            }
            break
          default:
            return false
        }
      }
    }

    // now make the call
    return axios.post(`${helpers.rootUrl}api/table/update`, {
      id: tableID,
      room_id: roomID,
      seat_count: seatCount,
      label_position: labelPosition,
      ...formattedCoords
    })
      .then(response => {
        // load the updated or new table into the store
        const updatedTables = {
          ...getState().entities.tables,
          [response.data.id]:response.data
        }
        dispatch(receiveTables(updatedTables))
        dispatch(setLoadingStatus('tables', false))
      })
      .catch(response => {
        dispatch(requestError('save-table', response.message))
        dispatch(setLoadingStatus('tables', false))
      })
  }
}

export function removeTableRequest(tableID) {
  return (dispatch) => {

    // just remove it from state first
    dispatch(removeTable(tableID))

    // delete its seats from state
    dispatch(deleteSeats(tableID))

    // now make call to actually delete from the DB
    axios.delete(`${helpers.rootUrl}api/table/${tableID}`)
    .catch(response => dispatch(requestError('delete-tables',response.message)))
  }
}
export function removeTable(tableID) {
  return {
    type: C.REMOVE_TABLE,
    tableID
  }
}