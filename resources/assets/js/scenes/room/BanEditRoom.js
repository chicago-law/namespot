import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const BanEditRoom = ({ currentRoom }) => {
  return (
    <div className="banner-text">
      <h3><FontAwesomeIcon icon={['fas', 'map-marker-alt']} />{currentRoom.name}</h3>
    </div>
  )
}

export default BanEditRoom

BanEditRoom.propTypes = {
  currentRoom: PropTypes.object.isRequired
}