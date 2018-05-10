import React from 'react'
import { Link } from 'react-router-dom'

const rootUrl = document.querySelector('body').dataset.root;

const Logo = () => (
  <div className='logo-container'>
    <Link to="/">
      <img src={"/namespot/public" + require('../../images/namespot-logo.svg')} />
    </Link>
  </div>
)

export default Logo;