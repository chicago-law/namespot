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
            ...response.data
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
      // [_snakeCase(attribute)]: value
      [attribute]: value
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
        const newRoomID = response.data.newRoomID
        dispatch(updateOffering(offeringID, 'room_id', newRoomID))

        // now download the room data for the new room
        axios.get(`${helpers.rootUrl}api/room/${newRoomID}`)
          .then(response => {
            const normalizedRoom = {
              [response.data.id]: {
                ...response.data
              }
            }
            dispatch(receiveRooms(normalizedRoom))

            // turn off loading
            dispatch(setLoadingStatus('rooms', false))
          })
          .catch(response => console.log(response))

        // Also re-download the students for this offering, which will
        // include their updated seat assignments.
        axios.get(`${helpers.rootUrl}api/enrollment/offering/${offeringID}`)
          .then((response) => {
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