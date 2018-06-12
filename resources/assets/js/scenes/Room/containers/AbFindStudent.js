import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import AbFindStudent from '../AbFindStudent';
// import {  } from '../../../actions'

const mapStateToProps = (state, ownProps) => {

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
    //
  }
}

const AbFindStudentContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AbFindStudent))

export default AbFindStudentContainer;