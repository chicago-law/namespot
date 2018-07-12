import React, { Component } from 'react';
import classNames from 'classnames/bind';

export default class AssignRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRoomId: 0
    }
  }

  handleRoomChangeDropdown(e) {
    this.setState({
      selectedRoomId: parseInt(e.target.value)
    })
  }

  handleSaveRoomButton() {
    if (this.state.selectedRoomId != 0) {
      this.props.requestUpdateOffering(this.props.currentOffering.id, 'room_id', this.state.selectedRoomId);
      this.props.setTask('offering-overview');
      this.props.setView('assign-seats');
      this.props.history.push(`/offering/${this.props.currentOffering.id}`);
      this.props.setModal('assign-room', false);
    }
  }

  componentDidMount() {
    this.props.requestRooms();
  }

  render() {

    const modalClasses = classNames({
      'modal-assign-room': true,
      'is-loading': this.props.loading.rooms
    });

    let aisRoomSuggestion = '';
    if (this.props.db_match_name != null) {
      aisRoomSuggestion = <p>The AIS database lists <strong>"{this.props.db_match_name}"</strong>, but you can choose something else if you know otherwise.</p>;
    } else {
      aisRoomSuggestion = <p>Because the university database has no room assignment listed for this class, you'll need to choose one now in order to proceed.</p>;
    }

    // filter and sort the list of rooms in the dropdown
    const filteredRooms = Object.keys(this.props.rooms).filter(roomId => this.props.rooms[roomId].type === 'template').sort((idA, idB) => this.props.rooms[idA].name < this.props.rooms[idB].name ? -1 : 1);

    return (
      <div className={modalClasses}>
        <header>
          <h2><i className="fa fa-map-marker-alt"></i>Choose Room</h2>
        </header>

        <main>
          <p>Please choose a room for this class. You can change this later if you need to.</p>
          {aisRoomSuggestion}
          <select value={this.state.selectedRoomId} onChange={(e) => this.handleRoomChangeDropdown(e)}>
            <option value="0">-- Select room --</option>
            {filteredRooms.map(roomId => (
              <option key={roomId} value={roomId} >{this.props.rooms[roomId].name}</option>
            ))}
          </select>
        </main>

        <footer className="controls">
          <button className='btn-clear' onClick={() => this.props.close()}><small>Cancel</small></button>
          <button className="btn-accent" onClick={() => this.handleSaveRoomButton()}>Use Selected Room</button>
        </footer>

      </div>
    )
  }
}