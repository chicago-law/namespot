import { connect } from 'react-redux';
import RosterGallery from '../RosterGallery';
import { assignSeat, setTask, setCurrentStudentId } from '../../../actions';

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
    currentOffering:state.app.currentOffering
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    assignSeat: (offering_id, student_id, seat_i) => {
      dispatch(assignSeat(offering_id, student_id, seat_i));
    },
    setTask: task => {
      dispatch(setTask(task));
    },
    setCurrentStudentId: id => {
      dispatch(setCurrentStudentId(id));
    }
  }
}

const RosterGalleryContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RosterGallery);

export default RosterGalleryContainer;