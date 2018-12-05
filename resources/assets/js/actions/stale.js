import C from '../constants'

export function markStale(entityType) {
  return {
    type: C.MARK_STALE,
    entityType,
  }
}

export function markNotStale(entityType) {
  return {
    type: C.MARK_NOT_STALE,
    entityType,
  }
}

export function setStaleStatus(entityType, status) {
  return (dispatch) => {
    if (status === false) {
      dispatch(markStale(entityType))
    }
    if (status === true) {
      dispatch(markNotStale(entityType))
    }
  }
}
