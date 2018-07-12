import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class AbOfferingOverview extends Component {
  constructor(props) {
    super(props)
  }

  handlePrintButtonClick() {
    this.props.setModal('print-room', true);
  }

  handleEditRoomClick() {
    // is the room already 'customized?
    if (this.props.currentRoom.type === 'template') {
      this.props.setTask('edit-room');
      this.props.setView('edit-room');
      // create a duplicate room and tables, and attach to this offering
      // (FYI, we do the url redirect from Room's componentDidMount)
     this.props.customizeOfferingRoom(this.props.currentOffering.id);
    } else {
      this.props.setTask('edit-room');
      this.props.setView('edit-room');
      this.props.history.push(`/room/${this.props.currentRoom.id}/${this.props.currentOffering.id}`);
    }
  }

  handleEditEnrollmentClick() {
    this.props.setModal('edit-enrollment', true);
  }

  render() {
    return (
      <div className='action-bar action-bar-offering-overview'>

        <div className="left"></div>

        <div className="center">
          <div className='click-an-empty-seat'>
            <svg className='empty-seat-icon' width="40" height="40" viewBox="0 0 40 40">
              <rect width="40" height="40"></rect>
              <g className="plus-person" transform="translate(9, 9)">
                <path d="M15,12 C17.21,12 19,10.21 19,8 C19,5.79 17.21,4 15,4 C12.79,4 11,5.79 11,8 C11,10.21 12.79,12 15,12 Z M6,10 L6,7 L4,7 L4,10 L1,10 L1,12 L4,12 L4,15 L6,15 L6,12 L9,12 L9,10 L6,10 Z M15,14 C12.33,14 7,15.34 7,18 L7,20 L23,20 L23,18 C23,15.34 17.67,14 15,14 Z"></path>
              </g>
            </svg>
            <p>{this.props.currentOffering.students.length ? 'Click an empty seat to place a student!' : 'Doesn\'t look like anyone is enrolled right now'}</p>
          </div>
        </div>

        <div className="right">
          <div className="offering-overview-controls">
            <button className='big-button' onClick={() => this.handlePrintButtonClick()}>
              <i className="far fa-print"></i>
              <p>Create<br />Prints</p>
            </button>
            <button className='big-button' onClick={() => this.handleEditRoomClick()} >
              <i className="far fa-cog"></i>
              <p>Edit Tables<br /> and Seats</p>
            </button>
            <button className='big-button' onClick={() => this.handleEditEnrollmentClick()} >
              <i className="far fa-user-plus"></i>
              <p>Find More<br /> Students</p>
            </button>
          </div>
        </div>

      </div>
    );
  }
}

AbOfferingOverview.propTypes = {
  currentRoom: PropTypes.object.isRequired,
  customizeOfferingRoom: PropTypes.func.isRequired,
  task: PropTypes.string.isRequired,
  setTask: PropTypes.func.isRequired
}