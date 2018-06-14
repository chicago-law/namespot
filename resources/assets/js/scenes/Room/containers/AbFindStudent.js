import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AbFindStudent from '../AbFindStudent';
import { assignSeat, setTask, setCurrentStudent } from '../../../actions'

const mapStateToProps = (state) => {

  // get the students enrolled in this class
  let currentStudents = [];
  Object.keys(state.entities.students).forEach(studentID => {
    if (state.app.currentOffering.students.includes(parseInt(studentID))) {
      currentStudents.push(state.entities.students[studentID]);
    }
  });

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
    setTask: (task) => {
      dispatch(setTask(task))
    },
    setCurrentStudent: (studentID) => {
      dispatch(setCurrentStudent(studentID))
    }
  }
}

const AbFindStudentContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AbFindStudent))

export default AbFindStudentContainer;