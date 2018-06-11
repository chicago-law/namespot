import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import Loading from '../../global/Loading'

export default class RoomList extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.requestRooms();
  }

  render() {

    const roomListClasses = classNames({
      'room-list':true,
      'is-loading':this.props.loading.rooms
    });

    return (
      <div className={roomListClasses}>
        <Loading />
        <h5>Select Room</h5>
        <ul>
          {Object.keys(this.props.rooms).map((id) => (
            <li key={id}>
              <Link to={`/room/${id}`}>
                <h4>{this.props.rooms[id].name}</h4>
              </Link>
              <i className="far fa-chevron-right"></i>
            </li>
          ))}
        </ul>
      </div>
    );
  }

}


RoomList.propTypes = {
  rooms: PropTypes.objectOf(PropTypes.shape({
    id:PropTypes.number.isRequired,
    name:PropTypes.string.isRequired
  }))
}