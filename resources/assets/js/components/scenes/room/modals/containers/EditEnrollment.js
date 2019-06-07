import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import EditEnrollment from '../EditEnrollment'
import {
 setModal,
 updateOffering,
 findAndSetCurrentOffering,
 requestRooms,
 setView,
 setTask,
 setLoadingStatus,
 requestError,
 receiveStudents,
 updateAndSaveStudent,
} from '../../../../../actions'

const mapStateToProps = ({ app, entities }, { match }) => ({
    rooms: entities.rooms,
    currentRoom: app.currentRoom,
    currentOffering: entities.offerings[match.params.offeringId] || null,
    loading: app.loading,
  })

const mapDispatchToProps = dispatch => ({
    setModal: (modal, status) => {
      dispatch(setModal(modal, status))
    },
    findAndSetCurrentOffering: (offeringId) => {
      dispatch(findAndSetCurrentOffering(offeringId))
    },
    requestRooms: () => {
      dispatch(requestRooms())
    },
    setView: (view) => {
      dispatch(setView(view))
    },
    setTask: (task) => {
      dispatch(setTask(task))
    },
    setLoadingStatus: (type, status) => {
      dispatch(setLoadingStatus(type, status))
    },
    requestError: (type, message, shouldLeave) => {
      dispatch(requestError(type, message, shouldLeave))
    },
    receiveStudents: (students) => {
      dispatch(receiveStudents(students))
    },
    updateAndSaveStudent: (student_id, attribute, value, offering_id) => {
      dispatch(updateAndSaveStudent(student_id, attribute, value, offering_id))
    },
    updateOffering: (offeringId, attribute, value) => {
      dispatch(updateOffering(offeringId, attribute, value))
    },
  })

const EditEnrollmentContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditEnrollment))

export default EditEnrollmentContainer
