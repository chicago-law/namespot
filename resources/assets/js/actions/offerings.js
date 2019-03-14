import { normalize } from 'normalizr'
import queryString from 'query-string'
import * as schema from './schema'
import C from '../constants'
import helpers from '../bootstrap'
import { receiveStudents } from './students'
import { receiveRooms } from './rooms'
import { markTermReceived } from './receivedOfferingsFor'
import {
  setLoadingStatus,
  requestError,
  findAndSetCurrentOffering,
} from './app'

/**
 * OFFERINGS!
 */

// load offerings into store
export function receiveOfferings(offerings) {
  return {
    type: C.RECEIVE_OFFERINGS,
    offerings,
  }
}
// Fetch all offerings, with optional filters.
export function fetchOfferings(options = {}, callback) {
  return (dispatch, getState) => {
    // Check for conditions that mean we don't need to actually do the fetch.
    const { receivedOfferingsFor } = getState()
    // Have we already got all offerings?
    if (receivedOfferingsFor.includes('all')) {
      return false
    }
    // Have we already got the term in question?
    if (options.termCode && receivedOfferingsFor.includes(options.termCode)) {
      return false
    }

    // We need it! Proceed.
    dispatch(setLoadingStatus('offerings', true))

    // Make API call
    const params = queryString.stringify(options)
    axios.get(`${helpers.rootUrl}api/offerings?${params}`)
    .then((response) => {
      const normalizedData = response.data.length ? normalize(response.data, schema.offeringListSchema) : null
      if (normalizedData != null) {
        const offerings = normalizedData.entities.offerings
        dispatch(receiveOfferings(offerings))
        dispatch(markTermReceived(options.termCode))
      }
      dispatch(setLoadingStatus('offerings', false))
      if (callback) callback()
    })
    .catch((response) => {
      dispatch(requestError('fetch-offerings', `Offerings fetch: ${response.message}`))
      dispatch(setLoadingStatus('offerings', false))
    })
  }
}

// Request and fetch a single offering by ID
// TODO: make requestOfferings also filter by ID
export function requestOffering(offering_id) {
  return (dispatch, getState) => {
    if (!getState().entities.offerings[offering_id]) {
      // set loading on
      dispatch(setLoadingStatus('offerings', true))
      // perform the fetch
      axios.get(`${helpers.rootUrl}api/offering/${offering_id}`)
      .then((response) => {
        const offeringObj = {
          [response.data.id]: {
            ...response.data,
          },
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
    offering_id,
attribute,
value,
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
      [attribute]: value,
    })
    .catch(response => dispatch(requestError('update-offering', response.message)))
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
      .then((response) => {
        // duplicates the offering's room and re-assigns offering to the new one,
        // then do an action to update the offering's room ID in the store (rather
        // than re-downloading all offerings to get the update)
        const newRoomID = response.data.newRoomID
        dispatch(updateOffering(offeringID, 'room_id', newRoomID))

        // now download the room data for the new room
        axios.get(`${helpers.rootUrl}api/room/${newRoomID}`)
          .then((response) => {
            const normalizedRoom = {
              [response.data.id]: {
                ...response.data,
              },
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
