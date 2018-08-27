import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import AbFindStudent from '../AbFindStudent'
import { assignSeat, setTask, setCurrentSeatId } from '../../../actions'

const mapStateToProps = (state) => {

  // get the students enrolled in this class
  const currentStudents = Object.keys(state.entities.students)
    .filter(id => state.app.currentOffering.students.includes(parseInt(id)))
    .map(id => state.entities.students[id])
    .sort((a, b) => b.last_name.toUpperCase() < a.last_name.toUpperCase() ? 1 : -1)

  return {
    currentStudents,
    currentOffering:state.app.currentOffering,
    currentSeatId:state.app.currentSeatId,
    task:state.app.task
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    assignSeat: (offering_id, student_id, seat_id) => {
      dispatch(assignSeat(offering_id, student_id, seat_id))
    },
    setTask: task => {
      dispatch(setTask(task))
    },
    setCurrentSeatId: seatId => {
      dispatch(setCurrentSeatId(seatId))
    }
  }
}

const AbFindStudentContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AbFindStudent))

export default AbFindStudentContainer