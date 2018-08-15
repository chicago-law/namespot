import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import OfferingList from '../OfferingList'
import helpers from '../../../bootstrap'
import { setView, requestOfferings, saveSessionTerm } from '../../../actions'

const mapStateToProps = (state) => {
  const recentOfferingsArray = localStorage.getItem('recentOfferings') ? JSON.parse(localStorage.getItem('recentOfferings')) : []

  return {
    defaultTerm: localStorage.getItem('selectedTerm') || helpers.termCodesFromYear(helpers.academicYear)[0],
    loading:state.app.loading,
    offerings:state.entities.offerings,
    recentOfferings: recentOfferingsArray,
    years: state.app.years
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setView: (view) => {
      dispatch(setView(view))
    },
    requestOfferings: termCode => {
      dispatch(requestOfferings(termCode))
    },
    saveSessionTerm: termCode => {
      dispatch(saveSessionTerm(termCode))
    }
  }
}

const OfferingListContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(OfferingList))

export default OfferingListContainer