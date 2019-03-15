import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import classNames from 'classnames/bind'
import _throttle from 'lodash/throttle'
import AbRoomOverview from './scenes/room/AbRoomOverview'
import AbEditTable from './scenes/room/AbEditTable'
import AbDeleteTable from './scenes/room/AbDeleteTable'
import AbOfferingOverview from './scenes/room/AbOfferingOverview'
import AbFindStudent from './scenes/room/AbFindStudent'
import AbStudentDetails from './scenes/room/AbStudentDetails'

class ActionBar extends Component {
  constructor(props) {
    super(props)
    this.throttledOnScroll = _throttle((e) => {
      this.onScroll(e)
    }, 50)
    this.state = {
      isFloating: false,
      bannerHeight: '',
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.throttledOnScroll)
    this.measureHeader()
  }

  componentWillUnmount() {
    this.throttledOnScroll.cancel()
    window.removeEventListener('scroll', this.throttledOnScroll)
  }

  measureHeader = () => {
    const banner = document.querySelector('.banner-container')
    const bannerHeight = parseFloat(window.getComputedStyle(banner).getPropertyValue('height'))
    this.setState({ bannerHeight })
  }

  onScroll = () => {
    const { bannerHeight } = this.state
    const currentScroll = window.pageYOffset
    if (currentScroll >= bannerHeight) {
      this.setState({ isFloating: true })
    } else {
      this.setState({ isFloating: false })
    }
  }

  render() {
    const { isFloating } = this.state
    const { task, currentOffering } = this.props

    let actionBarContents
    switch (task) {
      case 'edit-room':
        actionBarContents = <AbRoomOverview />
        break
      case 'edit-table':
        actionBarContents = <AbEditTable />
        break
      case 'delete-table':
        actionBarContents = <AbDeleteTable />
        break
      case 'offering-overview':
        actionBarContents = <AbOfferingOverview />
        break
      case 'find-student':
        actionBarContents = <AbFindStudent />
        break
      case 'student-details':
        actionBarContents = <AbStudentDetails />
        break
      default:
        actionBarContents = null
    }

    const actionBarContainerClasses = classNames({
      'action-bar-container': true,
      'is-floating': isFloating,
    })

    return (
      <div className={actionBarContainerClasses}>
        <Route path="/room/:roomID/" render={() => actionBarContents} />
        {currentOffering.students && currentOffering.students.length > 0 && (
          <Route path="/offering/:offeringID/" render={() => actionBarContents} />
        )}
      </div>
    )
  }
}

function mapStateToProps({ app }) {
  const { task, currentOffering } = app
  return {
    currentOffering,
    task,
  }
}

export default connect(mapStateToProps)(ActionBar)
