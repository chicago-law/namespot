import C from '../constants'

/**
 * receivedOfferingsFor
 */
const receivedOfferingsFor = (state = [], action) => {
  switch (action.type) {
    case C.MARK_TERM_RECEIVED:
      return [
        ...state,
        action.term
      ]
    default:
      return state
  }
}

export default receivedOfferingsFor
