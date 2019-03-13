import React, { Component } from 'react'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class AssignRoom extends Component {
  state = {
    selectedRoomId: 0,
  }

  handleRoomChangeDropdown(e) {
    this.setState({
      selectedRoomId: parseInt(e.target.value),
    })
  }

  handleSaveRoomButton() {
    if (this.state.selectedRoomId != 0) {
      this.props.requestUpdateOffering(this.props.currentOffering.id, 'room_id', this.state.selectedRoomId)
      this.props.setTask('offering-overview')
      this.props.setView('assign-seats')
      this.props.history.push(`/offering/${this.props.currentOffering.id}`)
      this.props.setModal('assign-room', false)
    }
  }

  componentDidMount() {
    this.props.requestRooms()
  }

  render() {
    const { selectedRoomId } = this.state
    const {
 close, currentRoom, loading, rooms,
} = this.props

    const modalClasses = classNames({
      'assign-room': true,
      'is-loading': loading.rooms,
    })

    let aisRoomSuggestion = ''
    if (currentRoom.db_match_name != null) {
      aisRoomSuggestion = <p>The AIS database lists <strong>"{currentRoom.db_match_name}"</strong>, but you can choose something else if you know otherwise.</p>
    } else {
      aisRoomSuggestion = <p>Because the university database has no room assignment listed for this class, you'll need to choose one now in order to proceed.</p>
    }

    // filter and sort the list of rooms in the dropdown
    const filteredRooms = Object.keys(rooms).filter(roomId => rooms[roomId].type === 'template').sort((idA, idB) => (rooms[idA].name < rooms[idB].name ? -1 : 1))

    return (
      <div className={modalClasses}>
        <header>
          <h2><FontAwesomeIcon icon={['fas', 'map-marker-alt']} />Choose Room</h2>
        </header>

        <main>
          <p>In order to assign seats or print out a seating chart, you must first assign a room to this class. You can change this later if you need to.</p>
          <select value={selectedRoomId} onChange={e => this.handleRoomChangeDropdown(e)}>
            <option value="0">-- Select room --</option>
            {filteredRooms.map(roomId => (
              <option key={roomId} value={roomId}>{rooms[roomId].name}</option>
            ))}
          </select>
        </main>

        <footer className="controls">
          <button className="btn-clear" onClick={() => close()}>Cancel</button>
          <button
            className="btn-accent"
            onClick={() => this.handleSaveRoomButton()}
            disabled={this.state.selectedRoomId === 0}
          >
            Use Selected Room
          </button>
        </footer>

      </div>
    )
  }
}

AssignRoom.propTypes = {
  close: PropTypes.func.isRequired,
  currentOffering: PropTypes.object.isRequired,
  currentRoom: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
  requestRooms: PropTypes.func.isRequired,
  requestUpdateOffering: PropTypes.func.isRequired,
  rooms: PropTypes.object.isRequired,
  setModal: PropTypes.func.isRequired,
  setTask: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired,
}
