import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class AbEditRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seatSize:30
    }
  }

  handleSeatSizeChange(e) {
    const value = e.target.value;
    this.setState({
      seatSize:value
    })
    this.props.setSeatSizeRequest(this.props.currentRoom.id, value);
  }

  handleAddNewClick() {
    this.props.newTable();
    this.props.setTask('edit-table');
    this.props.setPointSelection('start');
  }

  handleDeleteClick() {
    this.props.setTask('delete-table');
  }

  render() {
    return (
      <div className='action-bar action-bar-edit-room'>
        <div className="flex-container pull-top">
          <h6>Name</h6>
          <h4>{this.props.currentRoom.name ? this.props.currentRoom.name : 'Click to add'}<i className="far fa-pencil"></i></h4>
          <h6>Total Seats in Room</h6>
          <h4>15</h4>
        </div>

        <div className="controls">
          <div className="flex-container seat-size">
            <div className='seat-size-slider'>
              <div className='smaller'></div>
              <input type="range" min="15" max="45" step="3" value={this.state.seatSize} onChange={(e) => this.handleSeatSizeChange(e)} />
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
        </div>
      </div>
    )
  }
}

AbEditRoom.propTypes = {
  currentRoom:PropTypes.object.isRequired,
  newTable:PropTypes.func.isRequired,
  setTask:PropTypes.func.isRequired,
  setPointSelection:PropTypes.func.isRequired,
  setSeatSizeRequest:PropTypes.func.isRequired
}