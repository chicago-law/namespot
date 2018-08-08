import React from 'react'
import PropTypes from 'prop-types'

const RoomDetails = ({ currentRoom, currentOffering, currentSeats }) => {
  return (
    <div className="room-header">
      <p><i className="far fa-map-marker-alt fa-fw"></i> Located in {currentRoom.type === 'template' ? currentRoom.name : `${currentRoom.name} (edited)`}</p>
      <p className='enrollment'><i className="far fa-users fa-fw"></i> {currentSeats.length} seats in room, with {currentOffering.students.length} students enrolled</p>
      {/* <p><i className="far fa-retweet fa-fw"></i> Flip Perspective: OFF</p> */}
    </div>
  )
}

export default RoomDetails

RoomDetails.propTypes = {
  currentRoom: PropTypes.object.isRequired,
  currentOffering: PropTypes.object.isRequired
}

