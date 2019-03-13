import React from 'react'
import { Link } from 'react-router-dom'
import helpers from '../bootstrap'

const Logo = () => (
  <div className="logo-container">
    <Link to="/">
      <img src={`${helpers.rootUrl}images/namespot-logo.png`} alt="Namespot Logo" />
    </Link>
  </div>
)

export default Logo
