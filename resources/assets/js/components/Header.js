import React from 'react'
import { Route } from 'react-router-dom'
import Banner from './Banner'
import Logo from './Logo'
import ActionBar from './ActionBar'
import Nav from './Nav'

const Header = () => (
  <div className="card header-container">
    <header className="site-header">
      <Nav />
      <Banner />
      <Logo />
    </header>
    <Route path="/room/:roomId" component={ActionBar} />
    <Route path="/offering/:offeringId" component={ActionBar} />
  </div>
)

export default Header
