import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import FlashCardsDeck from '../FlashCardsDeck'
import { requestStudents, fetchAllStudentsFromTerm, setView, requestOffering, findAndSetCurrentOffering } from '../../../actions'

const mapStateToProps = (state, ownProps) => {

  // give component the current offering
  let currentOffering = {}
  if (ownProps.match.params.offeringid != null && Object.keys(state.entities.offerings).length && state.entities.offerings[ownProps.match.params.offeringid]) {
    currentOffering = state.entities.offerings[ownProps.match.params.offeringid]
  }

  // parse any URL parameters
  const urlParams = queryString.parse(ownProps.location.search)
  const namesOnReverse = urlParams.namesonreverse && urlParams.namesonreverse === 'true' ? true : false

  return {
    namesOnReverse,
    currentOffering,
    students: state.entities.students,
    offeringId: ownProps.match.params.offeringid,
    termCode: ownProps.match.params.termCode,
    loading: state.app.loading,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestStudents: id => {
      dispatch(requestStudents(id))
    },
    fetchAllStudentsFromTerm: termCode => {
      dispatch(fetchAllStudentsFromTerm(termCode))
    },
    setView: view => {
      dispatch(setView(view))
    },
    requestOffering: id => {
      dispatch(requestOffering(id))
    },
    findAndSetCurrentOffering: id => {
      dispatch(findAndSetCurrentOffering(id))
    },
  }
}

const FlashCardsDeckContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(FlashCardsDeck))

export default FlashCardsDeckContainer