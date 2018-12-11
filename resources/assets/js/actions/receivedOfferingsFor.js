import C from '../constants'

export function markTermReceived(term) {
  return {
    type: C.MARK_TERM_RECEIVED,
    term,
  }
}
