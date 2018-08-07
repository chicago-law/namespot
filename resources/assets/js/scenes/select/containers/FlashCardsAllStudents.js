import { connect } from 'react-redux'
import FlashCardsAllStudents from '../FlashCardsAllStudents'
import helpers from '../../../bootstrap'
import { fetchAllStudentsFromTerm, saveSessionTerm } from '../../../actions'

const mapStateToProps = (state) => {
  return {
    defaultTerm: localStorage.getItem('selectedTerm') || helpers.termCodesFromYear(state.app.years.academicYear)[0],
    terms: helpers.getAllTermCodes(state.app.years),
    years: state.app.years
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllStudentsFromTerm: (termCode) => {
      dispatch(fetchAllStudentsFromTerm(termCode))
    },
    saveSessionTerm: termCode => {
      dispatch(saveSessionTerm(termCode))
    }
  }
}

const FlashCardsAllStudentsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FlashCardsAllStudents)

export default FlashCardsAllStudentsContainer