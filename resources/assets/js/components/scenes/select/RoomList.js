import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames/bind'
import Loading from '../../Loading'
import helpers from '../../../bootstrap'
import {
  findAndSetCurrentRoom,
  receiveRooms,
  requestError,
  requestRooms,
  setLoadingStatus,
  setModal,
  setView,
} from '../../../actions'

class RoomList extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(requestRooms())
    dispatch(setView('room-list'))
  }

  handleNewRoom = () => {
    const { dispatch, history } = this.props

    // TODO: Move this to the Room actions file.
    dispatch(setLoadingStatus('rooms', true))
    axios.put(`${helpers.rootUrl}api/room`)
      .then((response) => {
        const formattedRoom = {
          [response.data.id]: {
            ...response.data,
            type: 'template',
            seat_size: 25,
          },
        }
        dispatch(receiveRooms(formattedRoom))
        dispatch(setLoadingStatus('rooms', false))
        history.push(`/room/${response.data.id}`)
      })
      .catch((response) => {
        dispatch(requestError('create-room', response.message, true))
        dispatch(setLoadingStatus('rooms', false))
      })
  }

  onDeleteRoomClick = (e) => {
    const { dispatch } = this.props
    const { roomId } = e.target.closest('.delete-room').dataset
    dispatch(findAndSetCurrentRoom(roomId))
    dispatch(setModal('confirm-room-delete', true))
  }

  render() {
    const { loading, rooms } = this.props

    // sort the rooms
    const sortedRooms = Object.keys(rooms)
      .sort((idA, idB) => (rooms[idA].name < rooms[idB].name ? -1 : 1))
    // remove any custom rooms, leaving only the templates
    const filteredRooms = sortedRooms.filter(id => rooms[id].type === 'template')
    const roomListClasses = classNames({
      'room-list': true,
      'is-loading': loading.rooms,
    })

    return (
      <div className={roomListClasses}>

        <Loading />

        <header>
          <h5>Select Room</h5>
        </header>

        <ul className="content">
          <li>
            <button type="button" onClick={() => this.handleNewRoom()}>
              <h4><FontAwesomeIcon icon={['far', 'plus-circle']} /> Create New Room</h4>
              <FontAwesomeIcon icon={['far', 'chevron-right']} />
            </button>
          </li>
          {filteredRooms.map(id => (
            <li key={id}>
              <Link to={`/room/${id}`}>
                <h4>{rooms[id].name}</h4>
              </Link>
              <button
                type="button"
                className="delete-room"
                title="Delete Room?"
                onClick={this.onDeleteRoomClick}
                data-room-id={id}
              >
                <FontAwesomeIcon icon={['far', 'trash-alt']} />
              </button>
              <FontAwesomeIcon icon={['far', 'chevron-right']} />
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = ({ entities, app }) => ({
  rooms: entities.rooms,
  loading: app.loading,
})

export default connect(mapStateToProps)(RoomList)
