import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Nav from './Nav'
import Banner from './Banner'
import Logo from './Logo'
// import AssignSeatsActionBar from '../scenes/AssignSeats/containers/ActionBar'
import EditRoomActionBar from '../scenes/EditRoom/ActionBar'

const Header = () => (
  <div className='card'>
    <header className="site-header">
      <Nav />
      <Banner />
      <Logo />
    </header>
    <div className='action-bar'>
      {/* <Route path="/class/:id" component={AssignSeatsActionBar} /> */}
      <Route path="/room/:id" component={EditRoomActionBar}/>
    </div>
  </div>
)

export default Header;