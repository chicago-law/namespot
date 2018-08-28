import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import classNames from 'classnames/bind'
import _throttle from 'lodash/throttle'
import AbRoomOverview from '../scenes/room/containers/AbRoomOverview'
import AbEditTable from '../scenes/room/containers/AbEditTable'
import AbDeleteTable from '../scenes/room/containers/AbDeleteTable'
import AbOfferingOverview from '../scenes/room/containers/AbOfferingOverview'
import AbFindStudent from '../scenes/room/containers/AbFindStudent'
import AbStudentDetails from '../scenes/room/containers/AbStudentDetails'

export default class ActionBar extends Component {
  constructor(props) {
    super(props)
    this.throttledOnScroll = _throttle((e) => {
      this.onScroll(e)
    }, 100, {
      leading: true,
      trailing: false
    })
  }
  state = {
    isFloating: false,
    bannerHeight: ''
  }

  measureHeader() {
    const banner = document.querySelector('.banner-container')
    const bannerHeight = parseFloat(window.getComputedStyle(banner).getPropertyValue('height'))
    this.setState({ bannerHeight })
  }

  onScroll = (e) => {
    const currentScroll = e.pageY
    if (currentScroll >= this.state.bannerHeight) {
      this.setState({ isFloating: true})
    } else {
      this.setState({ isFloating: false})
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.throttledOnScroll)
    this.measureHeader()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.throttledOnScroll)
  }

  render() {
    const { task } = this.props

    let actionBarContents
    switch (task) {
      case 'edit-room':
        actionBarContents = <AbRoomOverview />
        break
      case 'edit-table':
        actionBarContents = <AbEditTable />
        break
      case 'delete-table':
        actionBarContents = <AbDeleteTable/>
        break
      case 'offering-overview':
        actionBarContents = <AbOfferingOverview/>
        break
      case 'find-student':
        actionBarContents = <AbFindStudent/>
        break
      case 'student-details':
        actionBarContents = <AbStudentDetails/>
        break
      default:
        actionBarContents = null
    }

    const actionBarContainerClasses = classNames({
      'action-bar-container': true,
      'is-floating': this.state.isFloating
    })

    return (
      <div className={actionBarContainerClasses}>
        <Route path={'/room/:roomID/'} render={() => actionBarContents} />
        <Route path={'/offering/:offeringID/'} render={() => actionBarContents} />
      </div>
    )
  }
}

ActionBar.propTypes = {
  task:PropTypes.string.isRequired
}