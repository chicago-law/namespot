import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Banner from './Banner'
import Logo from './Logo'
import ActionBar from './ActionBar'
import Nav from './Nav'

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.headerRef = React.createRef();
  }

  render() {
    return (
      <div className='card header-container' ref={this.headerRef}>
        <header className="site-header">
          <Nav />
          <Banner />
          <Logo />
        </header>
        <div className='action-bar-container'>
          <ActionBar />
        </div>
      </div>
    )
  }
}