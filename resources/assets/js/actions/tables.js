import { normalize } from 'normalizr'
import * as schema from './schema';
import { rootUrl } from './index';
import C from '../constants';
import { clearTempTable, setRoomLoadingStatus } from './app';

/**
 * ENTITY TABLES
 */
// load tables into state
export function receiveTables(response) {
  // loop through the tables. for each one, concat the coords into start, end, curve
  let tables = {}
  Object.keys(response.tables).forEach(key => {
    tables = {
      ...tables,
      [key]: {
        ...response.tables[key],
        coords: {
          'start': response.tables[key].sX + '_' + response.tables[key].sY,
          'end': response.tables[key].eX + '_' + response.tables[key].eY,
          'curve': response.tables[key].qX + '_' + response.tables[key].qY,
        }
      }
    }
  });
  return {
    type: C.RECEIVE_TABLES,
    tables
  }
}
// fetch the tables from DB
export function fetchTables(roomID) {
  return function (dispatch) {
    return axios.get(`${rootUrl}api/tables/${roomID}`)
      .then(function (response) {
        // tables downloaded, now load them into state and clear the tempTable
        const normalizedData = normalize(response.data, schema.tableListSchema);
        dispatch(receiveTables(normalizedData.entities));
        dispatch(clearTempTable());
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
// save a table to the DB, and then fetch new tables
export function saveTable(tableID, roomID, coords, seatCount) {
  return function (dispatch) {

    // first change to loading status
    dispatch(setRoomLoadingStatus(true));

    // first we need to format the coords into the flat, DB-friendly format
    let formattedCoords = { sX: null, sY: null, eX: null, eY: null, qX: null, qY: null };
    for (let coordType in coords) {
      if (coords.hasOwnProperty(coordType) && coords[coordType] !== "null_null" && coords[coordType] !== null) {
        const split = coords[coordType].split('_');
        switch (coordType) {
          case 'start':
            formattedCoords = {
              ...formattedCoords, sX: split[0], sY: split[1]
            }
            break;
          case 'end':
            formattedCoords = {
              ...formattedCoords, eX: split[0], eY: split[1]
            }
            break;
          case 'curve':
            formattedCoords = {
              ...formattedCoords, qX: split[0], qY: split[1]
            }
            break;
          default:
            return false;
        }
      }
    }

    // now make the call
    return axios.post(`${rootUrl}api/table/update`, {
      id: tableID,
      room_id: roomID,
      seat_count: seatCount,
      ...formattedCoords
    })
      .then(function (response) { // table succesfully saved, so let's refresh our list with a new Fetch
        dispatch(fetchTables(roomID));
        dispatch(setRoomLoadingStatus(false))
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
export function removeTableRequest(tableID) {
  return (dispatch) => {

    // just remove it from state first
    dispatch(removeTable(tableID))

    // now make call to actually delete from the DB
    return axios.delete(`${rootUrl}api/table/${tableID}`)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
export function removeTable(tableID) {
  return {
    type: C.REMOVE_TABLE,
    tableID
  }
}


