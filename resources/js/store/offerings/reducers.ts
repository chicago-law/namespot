import { OfferingsState, OfferingsActionTypes, RECEIVE_OFFERINGS, REMOVE_OFFERING, REMOVE_ALL_OFFERINGS } from './types'

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
    case REMOVE_ALL_OFFERINGS:
      return {}
    default:
      return state
  }
}

export default offerings
