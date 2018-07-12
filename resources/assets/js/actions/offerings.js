import { normalize } from 'normalizr'
import * as schema from './schema';
import C from '../constants';
import { rootUrl } from './index';
import { receiveStudents } from './students';
import { receiveRooms } from './rooms';
import { setLoadingStatus, requestError } from './app';

/**
 * OFFERINGS!
 */

// load offerings into store
export function receiveOfferings(offerings) {
  return {
    type: C.RECEIVE_OFFERINGS,
    offerings: offerings
  }
}
// Fetch all offerings for a given term code
export function fetchOfferings(termCode) {
  return (dispatch) => {
    // set loading state
    dispatch(setLoadingStatus('offerings',true));
    // make API call
    axios.get(`${rootUrl}api/offerings/${termCode}`)
    .then(response => {
      const normalizedData = response.data.length ? normalize(response.data, schema.offeringListSchema) : null;
      normalizedData != null ? dispatch(receiveOfferings(normalizedData.entities.offerings)) : false;
      dispatch(setLoadingStatus('offerings',false));
    })
    .catch(response => {
      dispatch(requestError('fetch-offerings',`Offerings fetch: ${response.message}`));
      dispatch(setLoadingStatus('offerings',false));
    });
  }
}
// Gently request a fresh load of offerings
export function requestOfferings(termCode) {
  return (dispatch, getState) => {
    // look through the offerings already in entities. if you have more than 1
    // that has the termCode provided, then we do not need to fetch more.

    const offeringsObj = getState().entities.offerings;
    const offeringIdArray = Object.keys(offeringsObj);

    let offeringsWithTermCode = 0;
    offeringIdArray.forEach(id => {
      offeringsObj[id].term_code === termCode ? offeringsWithTermCode++ : false;
    });

    offeringsWithTermCode > 1 ? false : dispatch(fetchOfferings(termCode));
  }
}

// Request and fetch a single offering by ID
export function requestOffering(offering_id) {
  return (dispatch, getState) => {
    if (!getState().entities.offerings[offering_id]) {
      // set loading on
      dispatch(setLoadingStatus('offerings',true));
      // perform the fetch
      axios.get(`${rootUrl}api/offering/${offering_id}`)
      .then(response => {
        const offeringObj = {
          [response.data.id]: {
            ...response.data
          }
        }
        dispatch(receiveOfferings(offeringObj))
        // turn off loading
        dispatch(setLoadingStatus('offerings', false));
      })
    }
  }
}

// update an offering's room ID
// export function updateOfferingRoom(offering_id, room_id) {
//   return {
//     type: C.UPDATE_OFFERING_ROOM,
//     offering_id, room_id
//   }
// }
// // request update to change an offering's room, including in the DB
// export function requestUpdateOfferingRoom(offering_id, room_id) {
//   return dispatch => {
//     // update it in the store
//     dispatch(updateOfferingRoom(offering_id, room_id))

//     // send update to db
//     axios.post(`${rootUrl}api/offering/${offering_id}`, {
//       room_id
//     })
//     // .then(response => console.log(response))
//     .catch(response => {
//       console.log(response);
//     })
//   }
// }

// update an offering in the store
export function updateOffering(offering_id, attribute, value) {
  return {
    type: C.UPDATE_OFFERING,
    offering_id, attribute, value
  }
}

// request update to an offering in the store as well as the DB
export function requestUpdateOffering(offering_id, attribute, value) {
  return dispatch => {
    // update it in the store
    dispatch(updateOffering(offering_id, attribute, value))

    // send update to db
    axios.post(`${rootUrl}api/offering/update/${offering_id}`, {
      [attribute]: value
    })
    // .then(response => console.log(response))
    .catch(response => {
      dispatch(requestError('update-offering',response.message));
      console.log(response);
    })
  }
}

// take an offering, duplicate its rooms and tables, and re-assign students
// to the new tables
export function customizeOfferingRoom(offeringID) {
  return (dispatch) => {

    // turn on loading
    dispatch(setLoadingStatus('rooms', true));
    dispatch(setLoadingStatus('students', true));

    // send out the request to make the new room
    axios.get(`${rootUrl}api/create-room-for/${offeringID}`)
    .then(response => {
      // duplicates the offering's room and re-assigns offering to the new one,
      // then do an action to update the offering's room ID in the store (rather
      // than re-downloading all offerings to get the update)
      // console.log(response);
      const newRoomID = response.data.newRoomID;
      dispatch(updateOffering(offeringID, 'room_id', newRoomID));

      // now download the room data for the new room
      axios.get(`${rootUrl}api/room/${newRoomID}`)
      .then(response => {
        // console.log(response);
        // const normalizedData = normalize(response.data, schema.roomListSchema);
        const normalizedRoom = {
          [response.data.id]: {
            ...response.data
          }
        }
        dispatch(receiveRooms(normalizedRoom));

        // once we know the new room is in the store,
        // we need to set the current room to this
        // update: probably doesn't need to happen here because we're doing it
        // in the Room component on every update
        // dispatch(findAndSetCurrentRoom(newRoomID));

        // finally, turn off loading
        dispatch(setLoadingStatus('rooms', false));
      })
      .catch(response => console.log(response));

      // now re-download the students for this offering
      axios.get(`${rootUrl}api/enrollment/${offeringID}`)
      .then((response) => {
        // console.log(response);
        const normalizedData = normalize(response.data, schema.studentListSchema);
        dispatch(receiveStudents(normalizedData.entities.students))

        // turn off loading
        dispatch(setLoadingStatus('students', false));
      })
      .catch(response => console.log(response));
    })
    .catch(response => console.log(response));
  }
}