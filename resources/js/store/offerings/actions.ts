import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { RECEIVE_OFFERINGS, OfferingsActionTypes, Offering, REMOVE_OFFERING } from './types'
import api, { CreateOfferingParams } from '../../utils/api'
import { markTermOfferingsReceived } from '../session/actions'
import { setLoadingStatus } from '../loading/actions'
import { receiveEnrollments } from '../enrollments/actions'
import { AppState } from '..'
import { reportAxiosError } from '../errors/actions'

export const receiveOfferings = (
  offerings: { [offeringId: string]: Offering },
): OfferingsActionTypes => ({
  type: RECEIVE_OFFERINGS,
  offerings,
})

export const removeOffering = (
  offeringId: string,
): OfferingsActionTypes => ({
  type: REMOVE_OFFERING,
  offeringId,
})

export const getOfferingsByTerm = (
  termCode: number,
) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  dispatch(setLoadingStatus('offerings', true))
  api.fetchOfferings({ termCode })
    .then(({ data }) => {
      dispatch(receiveOfferings(data.offerings))
      dispatch(markTermOfferingsReceived(termCode))
      dispatch(setLoadingStatus('offerings', false))
    })
    .catch((response) => dispatch(reportAxiosError(response)))
}

export const getOfferingById = (
  offeringId: string,
) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  dispatch(setLoadingStatus('offerings', true))
  api.fetchOfferings({ id: offeringId })
    .then(({ data }) => {
      if (Object.keys(data.offerings).length === 0) {
        throw new Error(`No offering returned from server id ${offeringId}`)
      }
      dispatch(setLoadingStatus('offerings', false))
      dispatch(receiveOfferings(data.offerings))
    })
    .catch((response) => dispatch(reportAxiosError(response)))
}

export const updateOffering = (
  offeringId: string,
  updates: Partial<Offering>,
  optimistic = false,
  callback?: (offering: Offering) => void,
) => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
  getState: () => AppState,
) => {
  if (optimistic) {
    const updatedOffering = {
      ...getState().offerings[offeringId],
      ...updates,
    }
    dispatch(receiveOfferings({
      [offeringId]: updatedOffering,
    }))
    if (callback) callback(updatedOffering)
  } else {
    dispatch(setLoadingStatus('offerings', true))
  }
  api.updateOffering(offeringId, updates)
    .then(({ data }) => {
      dispatch(receiveOfferings(data.offerings))
      dispatch(receiveEnrollments(data.enrollments))
      dispatch(setLoadingStatus('offerings', false))
    })
    .catch((response) => dispatch(reportAxiosError(response)))
}

export const createOffering = (
  params: CreateOfferingParams,
  callback?: (offeringId: string) => void,
) => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  api.createOffering(params)
    .then(({ data }) => {
      dispatch(receiveOfferings(data.offerings))
      // If callback, call it with the ID of the new offering.
      if (callback) callback(Object.values(data.offerings)[0].id)
    })
}

export const deleteOffering = (
  offeringId: string,
  optimistic = true,
  callback?: () => void,
) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  if (optimistic) dispatch(removeOffering(offeringId))
  api.deleteOffering(offeringId)
    .then(() => {
      if (callback) callback()
      if (!optimistic) dispatch(removeOffering(offeringId))
    })
    .catch((response) => dispatch(reportAxiosError(response)))
}
