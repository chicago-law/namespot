import React, { Component } from 'react';
import { Link } from 'react-router-dom'

export default class AbEditRoom extends Component {
  constructor(props) {
    super(props);
  }

  handleSeatSizeChange(e) {
    const value = e.target.value;
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

  componentDidMount() {
    // dispatch action to set app state in store to 'edit-table'
    this.props.setTask('edit-room');
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

        {/* <div className="flex-container description pull-top">
          <h6>Description</h6>
          <h4>{this.props.currentRoom.description ? this.props.currentRoom.description : 'Click to add'}<i className="far fa-pencil"></i></h4>
        </div> */}

        <div className="controls">
          <div className="flex-container seat-size">
            <div className='seat-size-slider'>
              <div className='smaller'></div>
              <input type="range" min="15" max="45" step="3" value={this.props.currentRoom.seat_size || '30'} onChange={(e) => this.handleSeatSizeChange(e)} />
              <div className="larger"></div>
            </div>
            <p><small>Seat Size</small></p>
          </div>

          <div className="flex-container">
            <Link to={`${this.props.match.url}/section/new`} onClick={() => this.handleAddNewClick()}>
              <button className='big-button'>
                <i className="far fa-plus-circle"></i>
                <p>Add New<br />Section</p>
              </button>
            </Link>
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