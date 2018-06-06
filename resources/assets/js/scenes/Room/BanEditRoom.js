import React from 'react'

const BanEditRoom = ({ rooms, match }) => {
  let roomName = '';
  if (rooms[match.params.id]) {
    roomName = rooms[match.params.id].name;
  }
  return (
    <div className="banner-text">
      <h3><i className="far fa-cog"></i>{roomName}</h3>
    </div>
  );
}

export default BanEditRoom