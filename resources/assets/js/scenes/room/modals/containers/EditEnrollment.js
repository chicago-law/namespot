import { connect } from 'react-redux';
import EditEnrollment from '../EditEnrollment';
import { setModal, requestUpdateOffering, requestRooms, setView, setTask, setLoadingStatus, requestError, receiveStudents, updateAndSaveStudent } from '../../../../actions';

const mapStateToProps = (state) => {

  return {
    rooms: state.entities.rooms,
    currentRoom: state.app.currentRoom,
    currentOffering: state.app.currentOffering,
    loading: state.app.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setModal: (modal, status) => {
      dispatch(setModal(modal, status))
    },
    requestUpdateOffering: (offering_id, attribute, value) => {
      dispatch(requestUpdateOffering(offering_id, attribute, value))
    },
    requestRooms: () => {
      dispatch(requestRooms());
    },
    setView: (view) => {
      dispatch(setView(view));
    },
    setTask: (task) => {
      dispatch(setTask(task))
    },
    setLoadingStatus: (type, status) => {
      dispatch(setLoadingStatus(type, status));
    },
    requestError: (type, message, shouldLeave) => {
      dispatch(requestError(type, message, shouldLeave));
    },
    receiveStudents: (students) => {
      dispatch(receiveStudents(students));
    },
    updateAndSaveStudent: (student_id, attribute, value) => {
      dispatch(updateAndSaveStudent(student_id, attribute, value));
    }
  }
}

const EditEnrollmentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditEnrollment);

export default EditEnrollmentContainer;