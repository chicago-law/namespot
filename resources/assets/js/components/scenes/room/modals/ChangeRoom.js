import React, { Component } from 'react'
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class ChangeRoom extends Component {
  state = {
    selectedRoomId: 0,
  }

  handleRoomChangeDropdown(e) {
    this.setState({
      selectedRoomId: parseInt(e.target.value),
    })
  }

  handleRoomChangeButton() {
    if (this.state.selectedRoomId != 0) {
      this.props.requestUpdateOffering(this.props.currentOffering.id, 'room_id', this.state.selectedRoomId)
      this.props.setTask('offering-overview')
      this.props.setView('assign-seats')
      this.props.history.push(`/offering/${this.props.currentOffering.id}`)
      this.props.setModal('change-room', false)
    } else {
      this.props.setModal('change-room', false)
    }
  }

  componentDidMount() {
    this.props.requestRooms()
  }

  render() {
    const modalClasses = classNames({
      // 'change-room':true,
      'is-loading': this.props.loading.rooms,
    })

    return (
      <div className={modalClasses}>
        <header>
          <h2><FontAwesomeIcon icon={['fas', 'map-marker-alt']} />Change Room?</h2>
        </header>

        <main>
          <label>Change this class's room assignment to:</label><br />
          <select value={this.state.selectedRoomId} onChange={e => this.handleRoomChangeDropdown(e)}>
            <option value="0">-- Select different room --</option>
            { Object.keys(this.props.rooms).filter(roomId => this.props.rooms[roomId].type === 'template').map(roomId => (
              <option key={roomId} value={roomId}>{ this.props.rooms[roomId].name }</option>
            ))}
          </select>
          <div className="warning">
            <FontAwesomeIcon icon={['far', 'exclamation-triangle']} />
            <p>Please note that changing rooms will erase any seat assignments you've made in the class so far!</p>
          </div>
        </main>

        <footer className="controls">
          <button className="btn-clear" onClick={() => this.props.close()}>Cancel</button>
          <button className="btn-accent" onClick={() => this.handleRoomChangeButton()}>Change to this room</button>
        </footer>

      </div>
    )
  }
}
