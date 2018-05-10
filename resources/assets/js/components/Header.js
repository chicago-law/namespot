import React from 'react'
import Nav from './Nav'
import Banner from '../components/Banner'
import Logo from './Logo'
import ActionBar from './actionbar/ActionBar'

const Header = () => (
  <div>
    <header className="site-header card">
      <Nav />
      <Banner />
      <Logo />
    </header>
    <ActionBar/>
  </div>
)

export default Header;