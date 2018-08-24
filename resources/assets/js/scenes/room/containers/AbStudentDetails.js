import { connect } from 'react-redux'
import AbStudentDetails from '../AbStudentDetails'
import { updateAndSaveStudent, setTask, assignSeat, setCurrentStudentId, unenrollStudent, setModal } from '../../../actions'

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
    assignSeat: (offering_id, student_id, seat_id) => {
      dispatch(assignSeat(offering_id, student_id, seat_id))
    },
    setCurrentStudentId: id => {
      dispatch(setCurrentStudentId(id))
    },
    setModal: (modal, status) => {
      dispatch(setModal(modal, status))
    },
    setTask: (task) => {
      dispatch(setTask(task))
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