import React, { Component } from 'react'
import PropTypes from 'prop-types'
import helpers from '../../bootstrap'
import { FaCamera } from 'react-icons/fa/index.mjs'
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
    const student = this.props.students[this.props.currentStudentId]

    return (
      <div className='action-bar action-bar-student-details'>
        <i className="far fa-arrow-left" onClick={() => this.props.setTask('offering-overview')}></i>

        <div
          className='portrait'
          style={{ 'backgroundImage': `url('${helpers.rootUrl}images/students/${student.picture}')` }}
          onClick={this.onPortraitClick}
        >
          <div className='change-portrait' title='Change picture'>
            <FaCamera className='icon' />
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
          <h6>Email</h6>
          <p>{`${student.cnet_id}@uchicago.edu`}</p>
        </div>

        <div style={{'marginLeft':'auto'}}>
          { student.manual_attachments[`offering_${this.props.currentOffering.id}`] ?
            <button className='big-button pull-right' onClick={()=> this.onRemoveFromClass()}>
              <i className="far fa-sign-out"></i>
              <p>Remove Student<br/>from Class</p>
            </button>
          : false}

          { student.seats['offering_' + this.props.currentOffering.id] ?
            <button className='big-button pull-right' onClick={()=> this.handleUnseatClick()}>
              <i className="far fa-unlink"></i>
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