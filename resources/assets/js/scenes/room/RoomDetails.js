import React from 'react';
import PropTypes from 'prop-types';

const RoomDetails = ({ currentRoom, currentOffering, currentSeats }) => {
  return (
    <div className="room-header">

      {/* <div className="top-left"> */}
        <p><i className="far fa-map-marker-alt fa-fw"></i> Located in {currentRoom.name}</p>
      <p className='enrollment'><i className="far fa-users fa-fw"></i> {currentSeats.length} seats in room, with {currentOffering.students.length} students enrolled</p>
        <p><i className="far fa-retweet fa-fw"></i> Flip Perspective: OFF</p>
      {/* </div> */}

      {/* <div className="top-right">
      </div> */}

    </div>
  );
}

export default RoomDetails;

RoomDetails.propTypes = {
  currentRoom: PropTypes.object.isRequired,
  currentOffering: PropTypes.object.isRequired
}

