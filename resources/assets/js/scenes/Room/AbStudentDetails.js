import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class AbStudentDetails extends Component {
  constructor(props) {
    super(props);
    this.nicknameRef = React.createRef();
    this.state = {
      newNickname: '',
      isEditing:false
    }
  }

  handleNicknameClick() {
    this.setState({ isEditing:true })
    this.nicknameRef.current.setAttribute('contentEditable',true);
    this.nicknameRef.current.focus();
    window.getSelection().selectAllChildren(this.nicknameRef.current);
  }

  handleSaveClick() {
    this.nicknameRef.current.setAttribute('contentEditable', false);
    this.props.updateAndSaveStudent(this.props.currentStudentId, 'nickname', this.nicknameRef.current.textContent);
    this.setState({ isEditing:false });
    window.getSelection().removeAllRanges();
  }

  handleCancelClick() {
    this.nicknameRef.current.setAttribute('contentEditable', false);
    const original = this.props.students[this.props.currentStudentId].nickname ? this.props.students[this.props.currentStudentId].nickname : '(none set)';
    this.nicknameRef.current.textContent = original;
    this.setState({ isEditing:false })
    window.getSelection().removeAllRanges();
  }

  handleUnseatClick() {
    this.props.assignSeat(this.props.currentOffering.id, this.props.currentStudentId, null);
  }

  render() {
    const rootUrl = document.querySelector('body').dataset.root;
    const student = this.props.students[this.props.currentStudentId];
    const saveOrCancel = (
      <div className='save-or-cancel'>
        <button className='btn-accent' onClick={() => this.handleSaveClick()}>Save</button>
        <button onClick={() => this.handleCancelClick()}>Cancel</button>
      </div>
    );
    const startEditing = (
      <i className="far fa-pencil" onClick={() => this.handleNicknameClick()} title="Edit student's display name"></i>
    );

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
            <h6>Display Name</h6>
            <div className='nickname-container'>
              <p ref={this.nicknameRef}>{student.nickname ? student.nickname : '(none set)' }</p>
              <div className='nickname-controls'>
                { this.state.isEditing ? saveOrCancel : startEditing }
              </div>
            </div>
          </div>
        </div>
        <div className="flex-column">
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