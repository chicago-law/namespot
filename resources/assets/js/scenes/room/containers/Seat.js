import { connect } from 'react-redux'
import Seat from '../Seat'
import { setTask, setCurrentSeatId, setCurrentStudentId, requestError, removeError } from '../../../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    currentRoom: state.app.currentRoom,
    currentOffering: state.app.currentOffering,
    currentSeatId: state.app.currentSeatId,
    currentStudentId: state.app.currentStudentId,
    seats: state.entities.seats,
    students: state.entities.students,
    task:state.app.task,
    view: state.app.view,
    withStudents: ownProps.withStudents
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setTask: (task) => {
      dispatch(setTask(task))
    },
    setCurrentSeatId: (seatID) => {
      dispatch(setCurrentSeatId(seatID))
    },
    setCurrentStudentId: (studentID) => {
      dispatch(setCurrentStudentId(studentID))
    },
    requestError: (type, message, shouldLeave) => {
      dispatch(requestError(type, message, shouldLeave))
    },
    removeError: type => {
      dispatch(removeError(type))
    }
  }
}

const SeatContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Seat)

export default SeatContainer