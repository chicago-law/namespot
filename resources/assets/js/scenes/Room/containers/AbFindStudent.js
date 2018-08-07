import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import AbFindStudent from '../AbFindStudent'
import { assignSeat, setTask, setCurrentSeatId } from '../../../actions'

const mapStateToProps = (state) => {

  // get the students enrolled in this class
  let currentStudents = []
  Object.keys(state.entities.students).forEach(studentId => {
    if (state.app.currentOffering.students.includes(parseInt(studentId))) {
      currentStudents.push(state.entities.students[studentId])
    }
  })

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