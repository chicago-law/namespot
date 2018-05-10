import React from 'react'
import { Link } from 'react-router-dom'

const Menu = ({toggleMenu}) => (
  <div className="site-menu">
    <header>
      <button onClick={toggleMenu}>
        <i className="far fa-arrow-left fa-fw"></i>
      </button>
      <h3>Daniel<br/>Ramus</h3>
    </header>
    <ul>
      <li><Link className="reverse-colors" to="/" onClick={toggleMenu}><i className="far fa-map fa-fw"></i>Seating Charts</Link></li>
      <li><Link className="reverse-colors" to="/students" onClick={toggleMenu}><i className="far fa-users fa-fw"></i>Students</Link></li>
      <li><Link className="reverse-colors" to="/rooms" onClick={toggleMenu}><i className="far fa-cog fa-fw"></i>Room Templates</Link></li>
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