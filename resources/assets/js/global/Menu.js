import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import helpers from '../bootstrap'

const Menu = ({authedUser, toggleMenu}) => (
  <div className="site-menu">
    <header>
      <button onClick={toggleMenu}>
        <FontAwesomeIcon icon={['far', 'arrow-left']} fixedWidth />
      </button>
      {authedUser && <h3>{authedUser.first_name}<br/>{authedUser.last_name}</h3>}
    </header>
    <ul>
      <li><Link className="reverse-colors" to="/select/offerings" onClick={toggleMenu}><FontAwesomeIcon icon={['far', 'map']} fixedWidth />Classes</Link></li>
      <li><Link className="reverse-colors" to="/select/students" onClick={toggleMenu}><FontAwesomeIcon icon={['far', 'users']} fixedWidth />Students</Link></li>
      <li><Link className="reverse-colors" to="/select/rooms" onClick={toggleMenu}><FontAwesomeIcon icon={['fas', 'map-marker-alt']} fixedWidth />Rooms</Link></li>
    </ul>
    <ul>
      <li><Link className="reverse-colors" to="/select/settings" onClick={toggleMenu}><FontAwesomeIcon icon={['far', 'cog']} fixedWidth />Settings</Link></li>
      <li><Link className="reverse-colors" to="/" onClick={toggleMenu}><FontAwesomeIcon icon={['far', 'sign-out-alt']} fixedWidth />Logout</Link></li>
    </ul>
    <div className="school-logo-container">
      <img src={`${helpers.rootUrl}images/uchicago-logo.png`} />
    </div>
  </div>
)

function mapStateToProps({ authedUser }, ownProps) {
  return {
    authedUser: authedUser,
    toggleMenu: ownProps.toggleMenu
  }
}

export default connect(mapStateToProps)(Menu)

Menu.propTypes = {
  authedUser: PropTypes.object,
  toggleMenu: PropTypes.func.isRequired
}