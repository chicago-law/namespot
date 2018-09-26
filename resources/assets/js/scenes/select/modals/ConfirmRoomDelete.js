import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { requestRoomDelete } from '../../../actions'

class ConfirmRoomDelete extends Component {

  onDeleteRoom = () => {
    this.props.dispatch(requestRoomDelete(this.props.room.id))
    this.props.close()
  }

  render() {
    const { room } = this.props

    return (
      <div className='confirm-room-delete-content'>
        <header>
          <h2><FontAwesomeIcon icon={['far', 'trash-alt']} /> Really Delete Room?</h2>
        </header>

        <main>
          <p>Please confirm you'd like to delete this room:</p>
          <h4>{room && room.name}</h4>
          <div className="warning">
            <FontAwesomeIcon icon={['far', 'exclamation-triangle']} />
            <p>Any classes in this room will no longer have a room assignment. Any students seated in this room will be unseated.</p>
          </div>
        </main>

        <footer className='controls'>
          <button className='btn-clear' onClick={() => this.props.close()}>Keep This Room</button>
          <button className="btn-accent" onClick={() => this.onDeleteRoom()}>Yes, Delete {room && room.name}</button>
        </footer>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    room: state.entities.rooms[state.app.currentRoom.id]
  }
}

export default connect(mapStateToProps)(ConfirmRoomDelete)