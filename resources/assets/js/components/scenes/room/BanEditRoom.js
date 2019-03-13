import React from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const BanEditRoom = ({ currentRoom }) => (
  <div className="banner-text">
    <h3><FontAwesomeIcon icon={['fas', 'map-marker-alt']} />{currentRoom.name}</h3>
  </div>
)

const mapStateToProps = ({ app }) => ({
  currentRoom: app.currentRoom,
})

export default connect(mapStateToProps)(BanEditRoom)
