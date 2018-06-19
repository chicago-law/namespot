import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class AbOfferingOverview extends Component {
  constructor(props) {
    super(props)
  }

  handleEditRoomClick() {
    // is the room already 'customized?
    if (this.props.currentRoom.type === 'template') {
      this.props.setTask('edit-room');
      this.props.setView('edit-room');
      // create a duplicate room and tables, and attach to this offering
     this.props.customizeOfferingRoom(this.props.currentOffering.id);
    } else {
      this.props.setTask('edit-room');
      this.props.setView('edit-room');
      this.props.history.push(`/room/${this.props.currentRoom.id}/${this.props.currentOffering.id}`);
    }
  }

  render() {
    return (
      <div className='action-bar action-bar-offering-overview'>
        <div className='click-an-empty-seat'>
          <i className="far fa-user-plus"></i><p>Click an empty seat to place a student!</p>
        </div>
        <div className="offering-overview-controls">
          <button className='big-button' onClick={() => this.handleEditRoomClick()} >
            <i className="far fa-cog"></i>
            <p>Edit Tables<br /> and Seats</p>
          </button>
          <button className='big-button'>
            <i className="far fa-print"></i>
            <p>Create<br />Prints</p>
          </button>
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