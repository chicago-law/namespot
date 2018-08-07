import { connect } from 'react-redux'
import OfferingList from '../OfferingList'
import helpers from '../../../bootstrap'
import { setView, requestOfferings, saveSessionTerm } from '../../../actions'

const mapStateToProps = (state) => {
  return {
    offerings:state.entities.offerings,
    loading:state.app.loading,
    defaultTerm: localStorage.getItem('selectedTerm') || helpers.termCodesFromYear(helpers.academicYear)[0],
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

const OfferingListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OfferingList)

export default OfferingListContainer