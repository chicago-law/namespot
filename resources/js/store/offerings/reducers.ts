import { OfferingsState, OfferingsActionTypes, RECEIVE_OFFERINGS, REMOVE_OFFERING } from './types'

const offerings = (
  state: OfferingsState = {},
  action: OfferingsActionTypes,
): OfferingsState => {
  switch (action.type) {
    case RECEIVE_OFFERINGS:
      return {
        ...state,
        ...action.offerings,
      }
    case REMOVE_OFFERING: {
      const offerings = { ...state }
      delete offerings[action.offeringId]
      return offerings
    }
    default:
      return state
  }
}

export default offerings
