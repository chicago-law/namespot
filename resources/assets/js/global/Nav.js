import React, { Component } from 'react'
import Menu from './Menu'
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Nav extends Component {
  state = {
    menuOpen:false
  }

  toggleMenu() {
    const menuOpen = this.state.menuOpen
    this.setState({ menuOpen: !menuOpen })
  }

  render() {
    const navContainerClasses = classNames({
      'nav-container':true,
      'is-open':this.state.menuOpen
    })

    return (
      <div className={navContainerClasses}>
        <button type="button" className="nav-control" onClick={() => this.toggleMenu()}>
          <FontAwesomeIcon icon={['far', 'bars']} />
        </button>
        <Menu toggleMenu={() => this.toggleMenu()}/>
        <div className="shader" onClick={() => this.toggleMenu()}></div>
      </div>
    )
  }
}