import { normalize } from 'normalizr'
import * as schema from './schema'
import _snakeCase from 'lodash/snakeCase'
import C from '../constants'
import helpers from '../bootstrap'
import { receiveStudents } from './students'
import { receiveRooms } from './rooms'
import { setLoadingStatus, requestError, findAndSetCurrentOffering } from './app'

/**
 * OFFERINGS!
 */

// load offerings into store
export function receiveOfferings(offerings) {
  return {
    type: C.RECEIVE_OFFERINGS,
    offerings
  }
}
// Fetch all offerings for a given term code
export function fetchOfferings(termCode) {
  return (dispatch) => {
    // set loading state
    dispatch(setLoadingStatus('offerings',true))
    // make API call
    axios.get(`${helpers.rootUrl}api/offerings/${termCode}`)
    .then(response => {
      const normalizedData = response.data.length ? normalize(response.data, schema.offeringListSchema) : null
      // convert case from snake_case (DB, PHP) to camelCase for JS
      if (normalizedData != null) {
        const offerings = normalizedData.entities.offerings
        Object.keys(offerings).forEach(offeringId => {
          offerings[offeringId] = {
            id: offerings[offeringId].id,
            room_id: offerings[offeringId].room_id,
            long_title: offerings[offeringId].long_title,
            catalog_nbr: offerings[offeringId].catalog_nbr,
            section: offerings[offeringId].section,
            term_code: offerings[offeringId].term_code,
            instructors: offerings[offeringId].instructors,
            students: offerings[offeringId].students,
            paperSize: offerings[offeringId].paper_size,
            fontSize: offerings[offeringId].font_size,
            flipped: offerings[offeringId].flipped,
            namesToShow: offerings[offeringId].names_to_show,
            useNicknames: offerings[offeringId].use_nicknames,
            createdAt: offerings[offeringId].created_at,
            updatedAt: offerings[offeringId].updated_at,
          }
        })
        dispatch(receiveOfferings(offerings))
      }
      dispatch(setLoadingStatus('offerings',false))
    })
    .catch(response => {
      dispatch(requestError('fetch-offerings',`Offerings fetch: ${response.message}`))
      dispatch(setLoadingStatus('offerings',false))
    })
  }
}
// Gently request a fresh load of offerings
export function requestOfferings(termCode) {
  return (dispatch, getState) => {
    // look through the offerings already in entities. if you have more than 1
    // that has the termCode provided, then we do not need to fetch more.

    const offeringsObj = getState().entities.offerings
    const offeringIdArray = Object.keys(offeringsObj)

    let offeringsWithTermCode = 0
    offeringIdArray.forEach(id => {
      offeringsObj[id].term_code === termCode ? offeringsWithTermCode++ : false
    })

    offeringsWithTermCode > 1 ? false : dispatch(fetchOfferings(termCode))
  }
}

// Request and fetch a single offering by ID
export function requestOffering(offering_id) {
  return (dispatch, getState) => {
    if (!getState().entities.offerings[offering_id]) {
      // set loading on
      dispatch(setLoadingStatus('offerings',true))
      // perform the fetch
      axios.get(`${helpers.rootUrl}api/offering/${offering_id}`)
      .then(response => {
        const offeringObj = {
          [response.data.id]: {
            id: response.data.id,
            room_id: response.data.room_id,
            long_title: response.data.long_title,
            catalog_nbr: response.data.catalog_nbr,
            section: response.data.section,
            term_code: response.data.term_code,
            instructors: response.data.instructors,
            students: response.data.students,
            paperSize: response.data.paper_size,
            fontSize: response.data.font_size,
            flipped: response.data.flipped,
            namesToShow: response.data.names_to_show,
            useNicknames: response.data.use_nicknames,
          }
        }
        dispatch(receiveOfferings(offeringObj))
        // turn off loading
        dispatch(setLoadingStatus('offerings', false))
      })
    }
  }
}

// update an offering in the store
export function updateOffering(offering_id, attribute, value) {
  return {
    type: C.UPDATE_OFFERING,
    offering_id, attribute, value
  }
}

// request update to an offering in the store as well as the DB
export function requestUpdateOffering(offering_id, attribute, value) {
  return (dispatch) => {
    // update it in the store
    dispatch(updateOffering(offering_id, attribute, value))

    // since we updated an offering entity, we want to also update currentOffering
    dispatch(findAndSetCurrentOffering(offering_id))

    // send update to db
    axios.post(`${helpers.rootUrl}api/offering/update/${offering_id}`, {
      [_snakeCase(attribute)]: value
    })
    .catch(response => dispatch(requestError('update-offering',response.message)))
  }
}

// take an offering, duplicate its rooms and tables, and re-assign students
// to the new tables
export function customizeOfferingRoom(offeringID) {
  return (dispatch) => {

    // turn on loading
    dispatch(setLoadingStatus('rooms', true))
    dispatch(setLoadingStatus('students', true))

    // send out the request to make the new room
    axios.get(`${helpers.rootUrl}api/create-room-for/${offeringID}`)
    .then(response => {
      // duplicates the offering's room and re-assigns offering to the new one,
      // then do an action to update the offering's room ID in the store (rather
      // than re-downloading all offerings to get the update)
      // console.log(response);
      const newRoomID = response.data.newRoomID
      dispatch(updateOffering(offeringID, 'room_id', newRoomID))

      // now download the room data for the new room
      axios.get(`${helpers.rootUrl}api/room/${newRoomID}`)
      .then(response => {
        // console.log(response);
        // const normalizedData = normalize(response.data, schema.roomListSchema);
        const normalizedRoom = {
          [response.data.id]: {
            ...response.data
          }
        }
        dispatch(receiveRooms(normalizedRoom))

        // once we know the new room is in the store,
        // we need to set the current room to this
        // update: probably doesn't need to happen here because we're doing it
        // in the Room component on every update
        // dispatch(findAndSetCurrentRoom(newRoomID));

        // finally, turn off loading
        dispatch(setLoadingStatus('rooms', false))
      })
      .catch(response => console.log(response))

      // now re-download the students for this offering
      axios.get(`${helpers.rootUrl}api/enrollment/offering/${offeringID}`)
      .then((response) => {
        // console.log(response);
        const normalizedData = normalize(response.data, schema.studentListSchema)
        dispatch(receiveStudents(normalizedData.entities.students))

        // turn off loading
        dispatch(setLoadingStatus('students', false))
      })
      .catch(response => console.log(response))
    })
    .catch(response => console.log(response))
  }
}

// export function setPaperSize(paperSize) {
//   return {
//     type: C.SET_PAPER_SIZE,
//     paperSize
//   }
// }
// export function requestSetPaperSize(paperSize, offeringId) {
//   return dispatch => {
//     // set in store
//     dispatch(setPaperSize(paperSize))

//     // set in DB
//     axios.post(`${helpers.rootUrl}api/offering/update/${offeringId}`, {
//       'paper_size': paperSize
//     })
//     .catch(response => dispatch(requestError('update-paper-size',response.message)))
//   }
// }