import { connect } from 'react-redux'
import ChangePicture from '../ChangePicture'
import { requestError, setModal, updateAndSaveStudent } from '../../../../../actions'

const mapStateToProps = state => ({
    student: state.entities.students[state.app.currentStudentId],
  })

const mapDispatchToProps = dispatch => ({
    requestError: (error, message) => {
      dispatch(requestError(error, message))
    },
    setModal: (modal, status) => {
      dispatch(setModal(modal, status))
    },
    updateAndSaveStudent: (studentId, attribute, value) => {
      dispatch(updateAndSaveStudent(studentId, attribute, value))
    },
  })

const ChangePictureContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangePicture)

export default ChangePictureContainer
