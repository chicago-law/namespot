import React from 'react';
import PropTypes from 'prop-types';

const RoomHeader = ({ currentRoom, currentOffering }) => {
  return (
    <div className="room-header">

      <div className="top-left">
        <p><i className="far fa-map-marker-alt fa-fw"></i> {currentRoom.name}</p>
        <p><i className="far fa-users fa-fw"></i> {currentOffering.students.length} Students Enrolled</p>
      </div>

      <div className="top-right">
        <p><i className="far fa-retweet"></i> Flip Perspective: OFF</p>
      </div>

    </div>
  );
}

export default RoomHeader;

RoomHeader.propTypes = {
  currentRoom: PropTypes.object.isRequired,
  currentOffering: PropTypes.object.isRequired
}

