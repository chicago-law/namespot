import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import helpers from '../../../bootstrap'
import EditableText from '../../EditableText'
import {
  updateAndSaveStudent,
  setTask,
  assignSeat,
  setCurrentStudentId,
  unenrollStudent,
  setModal,
} from '../../../actions'

class AbStudentDetails extends Component {
  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(setCurrentStudentId(null))
  }

  handleBack = () => {
    const { dispatch } = this.props
    dispatch(setTask('offering-overview'))
  }

  saveStudentDetails = (nickname) => {
    const { dispatch } = this.props
    dispatch(updateAndSaveStudent(this.props.currentStudentId, 'nickname', nickname))
  }

  handleUnseatClick = () => {
    const { dispatch, currentOffering, currentStudentId } = this.props
    dispatch(assignSeat(currentOffering.id, currentStudentId, null))
  }

  onRemoveFromClass = () => {
    const { dispatch, currentStudentId, currentOffering } = this.props
    dispatch(unenrollStudent(currentStudentId, currentOffering.id))
    dispatch(setTask('offering-overview'))
    dispatch(setCurrentStudentId(null))
  }

  onPortraitClick = () => {
    const { dispatch } = this.props
    dispatch(setModal('change-picture', true))
  }

  render() {
    const { currentOffering, students, currentStudentId } = this.props
    const student = students[currentStudentId]
    const enrollment = student.enrollment[`offering_${currentOffering.id}`]

    return (
      <div className="action-bar action-bar-student-details">
        <FontAwesomeIcon icon={['far', 'arrow-left']} onClick={this.handleBack} />

        <div
          className="portrait"
          style={{ backgroundImage: `url('${helpers.rootUrl}storage/student_pictures/${student.picture}')` }}
          onClick={this.onPortraitClick}
        >
          <div className="change-portrait" title="Change picture">
            <FontAwesomeIcon icon="camera" />
          </div>
        </div>

        <div className="flex-column">
          <div>
            <h6>Full Name</h6>
            <p>{`${student.first_name} ${student.middle_name !== null ? student.middle_name : ''} ${student.last_name}`}</p>
          </div>
          <div>
            <h6>Short Name</h6>
            <p>
              {(student.short_first_name || student.short_last_name) && (
                <Fragment>
                  {student.short_first_name
                    ? student.short_first_name
                    : student.first_name
                  }
                  &nbsp;
                  {student.short_last_name
                    ? student.short_last_name
                    : student.last_name
                  }
                </Fragment>
              )}
            </p>
          </div>
        </div>

        <div className="flex-column">
          <h6>Seating Chart Nickname</h6>
          <div className="nickname-container">
            <EditableText
              text={student.nickname ? student.nickname : '(none set)'}
              save={nickname => this.saveStudentDetails(nickname)}
            />
          </div>
          <h6>CNet</h6>
          <p>{student.cnet_id}</p>
        </div>

        <div className="flex-column">
          <h6>Enrollment Sources</h6>
          <p>AIS status: {enrollment.is_in_ais === 1 ? 'enrolled' : 'not found'}</p>
          <p>Canvas status: {enrollment.canvas_enrollment_state != null
              ? enrollment.canvas_enrollment_state.split('_').join(' ')
              : 'not found'
            }
            {enrollment.canvas_role === 'Manually Added Student' && ' (enrolled by instructor)'}
          </p>
          {enrollment.is_namespot_addition === 1 && (
            <p>
              Added to class manually
              <span className="ab-student-details__remove" onClick={() => this.onRemoveFromClass()}><FontAwesomeIcon icon={['far', 'sign-out']} />Remove?</span>
            </p>
          )}
        </div>

        <div style={{ marginLeft: 'auto' }}>
          { student.enrollment[`offering_${currentOffering.id}`].seat !== null
            ? (
              <button className="big-button pull-right" onClick={() => this.handleUnseatClick()}>
                <FontAwesomeIcon icon={['far', 'unlink']} />
                <p>Remove Student<br />from Seat</p>
              </button>
)
          : false}
        </div>

      </div>
    )
  }
}

const mapStateToProps = ({ entities, app }) => ({
    students: entities.students,
    currentStudentId: app.currentStudentId,
    currentOffering: app.currentOffering,
  })

export default connect(mapStateToProps)(AbStudentDetails)
