import { normalize } from 'normalizr'
import * as schema from './schema';
import C from '../constants';
import { rootUrl } from './index';

/**
 * OFFERINGS!
 */
export function receiveOfferings(response) {
  return {
    type: C.RECEIVE_OFFERINGS,
    offerings: response.offerings
  }
}
// Fetch all offerings for a given term code
export function fetchOfferings(termCode) {

  return function (dispatch) {

    // now make the actual call
    return axios.get(`${rootUrl}api/offerings/${termCode}`)
      .then(function (response) {
        const normalizedData = response.data.length ? normalize(response.data, schema.offeringListSchema) : null;
        dispatch(receiveOfferings(normalizedData.entities))
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}