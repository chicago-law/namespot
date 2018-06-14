import React from 'react';
import PropTypes from 'prop-types';

const BanEditRoom = ({ currentRoom }) => {
  return (
    <div className="banner-text">
      <h3><i className="far fa-cog"></i>{currentRoom.name}</h3>
    </div>
  );
}

export default BanEditRoom

BanEditRoom.propTypes = {
  currentRoom: PropTypes.object.isRequired
}