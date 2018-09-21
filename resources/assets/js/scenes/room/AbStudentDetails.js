import React, { Component } from 'react'
import PropTypes from 'prop-types'
import helpers from '../../bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import EditableText from '../../global/containers/EditableText'

export default class AbStudentDetails extends Component {
  constructor(props) {
    super(props)
  }

  saveStudentDetails(nickname) {
    this.props.updateAndSaveStudent(this.props.currentStudentId, 'nickname', nickname)
  }

  handleUnseatClick() {
    this.props.assignSeat(this.props.currentOffering.id, this.props.currentStudentId, null)
  }

  onRemoveFromClass() {
    this.props.unenrollStudent(this.props.currentStudentId, this.props.currentOffering.id)
    this.props.setTask('offering-overview')
    this.props.setCurrentStudentId(null)
  }

  onPortraitClick = () => {
    this.props.setModal('change-picture', true)
  }

  componentWillUnmount() {
    this.props.setCurrentStudentId(null)
  }

  render() {
    const { currentOffering, students, currentStudentId } = this.props
    const student = students[currentStudentId]
    const enrollment = student.enrollment[`offering_${currentOffering.id}`]

    return (
      <div className='action-bar action-bar-student-details'>
        <FontAwesomeIcon icon={['far', 'arrow-left']} />

        <div
          className='portrait'
          style={{ 'backgroundImage': `url('${helpers.rootUrl}storage/student_pictures/${student.picture}')` }}
          onClick={this.onPortraitClick}
        >
          <div className='change-portrait' title='Change picture'>
            <FontAwesomeIcon icon='camera' />
          </div>
        </div>

        <div className='flex-column'>
          <div>
            <h6>Full Name</h6>
            <p>{`${student.first_name} ${student.last_name}`}</p>
          </div>
          <div>
            <h6>Short Name</h6>
            <p>{student.short_full_name}</p>
          </div>
        </div>

        <div className="flex-column">
        <h6>Seating Chart Nickname</h6>
          <div className='nickname-container'>
            <EditableText
              text={student.nickname ? student.nickname : '(none set)'}
              save={(nickname) => this.saveStudentDetails(nickname)}
            />
          </div>
          <h6>CNet</h6>
          <p>{student.cnet_id}</p>
        </div>

        <div className="flex-column">
          <h6>Enrollment Sources</h6>
          <p>AIS status: {enrollment.is_in_ais === 1
              ? enrollment.ais_enrollment_state !== null
                ? enrollment.ais_enrollment_state === 'E'
                  ? 'enrolled'
                  : enrollment.ais_enrollment_state
                : 'not found'
              : 'not found'
            }
          </p>
          <p>Canvas status: {enrollment.canvas_enrollment_state != null
              ? enrollment.canvas_enrollment_state.split('_').join(' ')
              : 'not found'
            }
            {enrollment.canvas_role === 'Manually Added Student' && ' (enrolled by instructor)'}
          </p>
          {enrollment.is_namespot_addition === 1 && (
            <p>
              Added to seating chart manually
              <span className='ab-student-details__remove' onClick={()=> this.onRemoveFromClass()}><FontAwesomeIcon icon={['far', 'sign-out']} />Remove?</span>
            </p>
          )}
        </div>

        <div style={{'marginLeft':'auto'}}>
          { student.enrollment[`offering_${currentOffering.id}`].seat !== null ?
            <button className='big-button pull-right' onClick={()=> this.handleUnseatClick()}>
              <FontAwesomeIcon icon={['far', 'unlink']} />
              <p>Remove Student<br/>from Seat</p>
            </button>
          : false}
        </div>

      </div>
    )
  }
}

AbStudentDetails.propTypes = {
  assignSeat: PropTypes.func.isRequired,
  currentOffering: PropTypes.object.isRequired,
  currentStudentId: PropTypes.number.isRequired,
  setCurrentStudentId: PropTypes.func.isRequired,
  setModal: PropTypes.func.isRequired,
  setTask: PropTypes.func.isRequired,
  students: PropTypes.object.isRequired,
  unenrollStudent: PropTypes.func.isRequired,
  updateAndSaveStudent: PropTypes.func.isRequired
}