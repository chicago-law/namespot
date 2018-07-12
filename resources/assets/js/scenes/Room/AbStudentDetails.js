import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { rootUrl } from '../../actions';
import EditableText from '../../global/containers/EditableText';

export default class AbStudentDetails extends Component {
  constructor(props) {
    super(props);
  }

  saveStudentDetails(nickname) {
    this.props.updateAndSaveStudent(this.props.currentStudentId, 'nickname', nickname);
  }

  validateNickname(nickname) {
    if (nickname.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  handleUnseatClick() {
    this.props.assignSeat(this.props.currentOffering.id, this.props.currentStudentId, null);
  }

  render() {
    const student = this.props.students[this.props.currentStudentId];

    return (
      <div className='action-bar action-bar-student-details'>
        <i className="far fa-arrow-left" onClick={() => this.props.setTask('offering-overview')}></i>
        <div className='portrait' style={{ 'backgroundImage': `url('${rootUrl}images/faces/${student.picture}.jpg')` }}></div>
        <div className='flex-column'>
          <div>
            <h6>Name</h6>
            <p>{student.first_name} {student.last_name}</p>
          </div>
          <div>
            <h6>Preferred Name</h6>
            <p>(pref. name here)</p>
          </div>
        </div>
        <div className="flex-column">
        <h6>Seating Chart Nickname</h6>
          <div className='nickname-container'>
            <EditableText
              text={student.nickname ? student.nickname : '(none set)'}
              save={(nickname) => this.saveStudentDetails(nickname)}
              // try to do the save! No validator!
              // validate={(nickname) => this.validateNickname(nickname)}
            />
          </div>
          <h6>Email</h6>
          <p>{student.email}</p>
        </div>
        { student.seats['offering_' + this.props.currentOffering.id] ?
          <button className='big-button remove-from-seat' onClick={()=> this.handleUnseatClick()}>
            <i className="far fa-unlink"></i>
            <p>Remove Student<br/>from Seat</p>
          </button>
        : false}
      </div>
    )
  }
}

AbStudentDetails.propTypes = {
  assignSeat: PropTypes.func.isRequired,
  currentOffering: PropTypes.object.isRequired,
  currentStudentId: PropTypes.number.isRequired,
  setTask: PropTypes.func.isRequired,
  students: PropTypes.object.isRequired,
  updateAndSaveStudent: PropTypes.func.isRequired
}