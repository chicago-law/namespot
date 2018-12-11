import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import OfferingList from '../OfferingList'
import { setView, fetchOfferings, saveSessionTerm } from '../../../actions'

const mapStateToProps = (state) => {
  const recentOfferingsArray = localStorage.getItem('recentOfferings') ? JSON.parse(localStorage.getItem('recentOfferings')) : []

  return {
    defaultTerm: localStorage.getItem('selectedTerm') || 'all',
    loading:state.app.loading,
    offerings:state.entities.offerings,
    recentOfferings: recentOfferingsArray,
    settings: state.settings,
    years: state.app.years
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setView: (view) => {
      dispatch(setView(view))
    },
    fetchOfferings: options => {
      dispatch(fetchOfferings(options))
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