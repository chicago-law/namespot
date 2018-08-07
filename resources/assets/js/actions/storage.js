import C from '../constants'

/**
 * session
 */
export function setSessionTerm(termCode) {
  return {
    type: C.SET_SESSION_TERM,
    termCode
  }
}
export function saveSessionTerm(termCode) {
  return (dispatch) => {

    // set the termCode in the store
    dispatch(setSessionTerm(termCode))

    // set the termCode in local storage for future access
    localStorage.setItem('selectedTerm', termCode)
  }
}