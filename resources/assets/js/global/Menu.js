import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

const Menu = ({toggleMenu}) => (
  <div className="site-menu">
    <header>
      <button onClick={toggleMenu}>
        <i className="far fa-arrow-left fa-fw"></i>
      </button>
      <h3>First name<br/>Last name</h3>
    </header>
    <ul>
      <li><Link className="reverse-colors" to="/select/offerings" onClick={toggleMenu}><i className="far fa-map fa-fw"></i>Seating Charts</Link></li>
      <li><Link className="reverse-colors" to="/select/students" onClick={toggleMenu}><i className="far fa-users fa-fw"></i>Students</Link></li>
      <li><Link className="reverse-colors" to="/select/rooms" onClick={toggleMenu}><i className="far fa-map-marker-alt fa-fw"></i>Rooms</Link></li>
    </ul>
    <ul>
      <li><Link className="reverse-colors" to="/" onClick={toggleMenu}><i className="far fa-sign-out-alt fa-fw"></i>Logout</Link></li>
    </ul>
    <div className="school-logo-container">
      <img src={"/namespot/public" + require('../../images/uchicago-logo.svg')} />
    </div>
  </div>
)

export default Menu;

Menu.propTypes = {
  toggleMenu: PropTypes.func.isRequired
}