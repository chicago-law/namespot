import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import NameTents from '../NameTents'
import { requestStudents, fetchAllStudentsFromTerm, setView, requestOffering, findAndSetCurrentOffering } from '../../../actions'

const mapStateToProps = (state, ownProps) => {

  // give component the current offering
  let currentOffering = {}
  if (ownProps.match.params.offeringid != null && Object.keys(state.entities.offerings).length && state.entities.offerings[ownProps.match.params.offeringid]) {
    currentOffering = state.entities.offerings[ownProps.match.params.offeringid]
  }

  // give component current students
  const currentStudents = Object.keys(state.entities.students)
    .filter(studentId => currentOffering.students.includes(parseInt(studentId)))
    .map(studentId => state.entities.students[studentId])
    .sort((a, b) => a.last_name < b.last_name ? -1 : 1)

  return {
    currentOffering,
    currentStudents,
    offeringId: ownProps.match.params.offeringid,
    students: state.entities.students,
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

const NameTentsContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NameTents))

export default NameTentsContainer