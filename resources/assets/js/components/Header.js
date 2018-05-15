import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Nav from './Nav'
import Banner from './Banner'
import Logo from './Logo'
import ActionBar from '../scenes/EditRoom/ActionBar'

const Header = () => (
  <div className='card'>
    <header className="site-header">
      <Nav />
      <Banner />
      <Logo />
    </header>
    <div className='action-bar-container'>
      <Route path="/room/:id" component={ActionBar}/>
    </div>
  </div>
)

export default Header;