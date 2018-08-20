import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import AbStudentDetails from '../AbStudentDetails'
import { updateAndSaveStudent, setTask, assignSeat, setCurrentStudentId, unenrollStudent } from '../../../actions'

const mapStateToProps = (state) => {
  return {
    students:state.entities.students,
    currentStudentId: state.app.currentStudentId,
    currentOffering:state.app.currentOffering
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateAndSaveStudent: (student_id, attribute, value) => {
      dispatch(updateAndSaveStudent(student_id, attribute, value))
    },
    setTask: (task) => {
      dispatch(setTask(task))
    },
    assignSeat: (offering_id, student_id, seat_id) => {
      dispatch(assignSeat(offering_id, student_id, seat_id))
    },
    setCurrentStudentId: id => {
      dispatch(setCurrentStudentId(id))
    },
    unenrollStudent: (studentId, offeringId) => {
      dispatch(unenrollStudent(studentId, offeringId))
    }
  }
}

const AbStudentDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AbStudentDetails)

export default AbStudentDetailsContainer