import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import EditableText from '../../global/containers/EditableText';
// import { rootUrl } from '../../actions';

export default class AbRoomOverview extends Component {
  constructor(props) {
    super(props);
  }

  handleSeatSizeChange(e) {
    this.props.requestRoomUpdate(this.props.currentRoom.id, 'seat_size', e.target.value);
  }

  handleAddNewClick() {
    this.props.newTable();
    this.props.setTask('edit-table');
    this.props.setPointSelection('start');
  }

  handleDeleteClick() {
    this.props.setTask('delete-table');
  }

  handleRoomChangeClick() {
    this.props.setModal('change-room',true);
  }

  handleContinueSeatingClick() {
    this.props.history.push(`/offering/${this.props.currentOffering.id}`);
    this.props.setTask('offering-overview');
    this.props.setView('assign-seats');
  }

  handleSaveRoomName(name, type) {
    this.props.requestRoomUpdate(this.props.currentRoom.id, type, name);
  }

  render() {
    return (
      <div className='action-bar action-bar-room-overview'>

        <div className="descriptions">
          <div className="flex-container pull-top">
            <h6>Name</h6>
            <EditableText
              text={this.props.currentRoom.name ? this.props.currentRoom.name : 'Click to add'}
              save={(name) => this.handleSaveRoomName(name, 'name')}
              validator='unique-room-name'
            />
            { this.props.currentRoom.type === 'template' ? (
              <div>
                <h6>AIS Name</h6>
                <EditableText
                  text={this.props.currentRoom.db_match_name ? this.props.currentRoom.db_match_name : 'Click to add'}
                  save={(name) => this.handleSaveRoomName(name, 'db_match_name')}
                  validator='unique-room-db-name'
                />
              </div>
            ) : false }
            {/* <h6>Total Seats in Room</h6>
            <h4>{this.props.seatCount}</h4> */}
          </div>
        </div>

        <div className="controls">

          <div className="flex-container seat-size">
            <div className='seat-size-slider'>
              <div className='smaller'></div>
              <input type="range" min="15" max="45" step="3" value={this.props.currentRoom.seat_size || 30} onChange={(e) => this.handleSeatSizeChange(e)} />
              <div className="larger"></div>
            </div>
            <p><small>Seat Size</small></p>
          </div>

          <div className="flex-container">
            <a href="javascript:void(0)" onClick={() => this.handleAddNewClick()}>
              <button className='big-button'>
                <i className="far fa-plus-circle"></i>
                <p>Add New<br />Section</p>
              </button>
            </a>
          </div>

          <div className="flex-container">
            <a href="javascript:void(0)" onClick={ () => this.handleDeleteClick() }>
              <button className='big-button'>
                <i className="far fa-trash-alt"></i>
                <p>Delete<br />Section</p>
              </button>
            </a>
          </div>

          <Route path="/room/:roomID/:offeringID" render={() =>
            <div className="flex-container">
              <a href="javascript:void(0)" onClick={ () => this.handleRoomChangeClick() }>
                <button className='big-button'>
                  <i className="far fa-map-marker-alt"></i>
                  <p>Change<br />Room</p>
                </button>
              </a>
            </div>
          } />

          <Route path="/room/:roomID/:offeringID" render={() =>
            <div className='continue-seating' onClick={() => this.handleContinueSeatingClick()}>
              <button className='btn-accent'>Continue Seating <i className="far fa-long-arrow-right"></i></button>
              <p>Return to assigning seats when ready</p>
            </div>
          } />

        </div>
      </div>
    )
  }
}

AbRoomOverview.propTypes = {
  currentRoom:PropTypes.object.isRequired,
  newTable:PropTypes.func.isRequired,
  setTask:PropTypes.func.isRequired,
  setPointSelection:PropTypes.func.isRequired,
  requestRoomUpdate:PropTypes.func.isRequired
}