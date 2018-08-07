import { connect } from 'react-redux'
import Settings from '../Settings'
import { setAcademicYear, requestError } from '../../../actions'

const mapStateToProps = (state) => {
  return {
    defaultYear: state.app.years.academicYear,
    years: state.app.years
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAcademicYear: year => {
      dispatch(setAcademicYear(year))
    },
    requestError: (error, message) => {
      dispatch(requestError(error, message))
    }
  }
}

const SettingsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)

export default SettingsContainer