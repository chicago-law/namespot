import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import Loading from '../../global/Loading'
import helpers from '../../bootstrap'

export default class RoomList extends Component {
  constructor(props) {
    super(props)
  }

  handleNewRoom() {
    this.props.setLoadingStatus('rooms',true)
    axios.put(`${helpers.rootUrl}api/room`)
    .then(response => {
      const formattedRoom = {
        [response.data.id]: {
          ...response.data,
          'type':'template',
          'seat_size':25
        }
      }
      this.props.receiveRooms(formattedRoom)
      this.props.setLoadingStatus('rooms',false)
      this.props.history.push(`/room/${response.data.id}`)
    })
    .catch(response => {
      this.props.requestError('create-room',response.message, true)
      this.props.setLoadingStatus('rooms',false)
    })
  }

  componentDidMount() {
    this.props.requestRooms()
    this.props.setView('room-list')
  }

  render() {

    // sort the rooms
    const sortedRooms = Object.keys(this.props.rooms).sort((idA, idB) => this.props.rooms[idA].name < this.props.rooms[idB].name ? -1 : 1)

    // remove any custom rooms, leaving only the templates
    const filteredClasses = sortedRooms.filter(id => this.props.rooms[id].type === 'template')

    const roomListClasses = classNames({
      'room-list':true,
      'is-loading':this.props.loading.rooms
    })

    return (
      <div className={roomListClasses}>

        <Loading />

        <header>
          <h5>Select Room</h5>
        </header>

        <ul className='content'>
          <li>
            <a href="javascript:void(0);" onClick={() => this.handleNewRoom()}>
              <h4><i className="far fa-plus-circle"></i> Create New Room</h4>
              <i className="far fa-chevron-right"></i>
            </a>
          </li>
          {filteredClasses.map((id) => (
            <li key={id}>
              <Link to={`/room/${id}`}>
                <h4>{this.props.rooms[id].name}</h4>
              </Link>
              <i className="far fa-chevron-right"></i>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

RoomList.propTypes = {
  requestRooms: PropTypes.func.isRequired,
  rooms: PropTypes.object.isRequired,
  setView: PropTypes.func.isRequired,
}