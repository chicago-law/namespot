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
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.throttledOnScroll)
  }

  componentWillUnmount() {
    this.throttledOnScroll.cancel()
    window.removeEventListener('scroll', this.throttledOnScroll)
  }

  onScroll = () => {
    const { bannerHeight } = this.props
    const currentScroll = window.pageYOffset
    if (currentScroll >= bannerHeight) {
      this.setState({ isFloating: true })
    } else {
      this.setState({ isFloating: false })
    }
  }

  getActionBarContents = (routeProps) => {
    const { task } = this.props
    let actionBarContents

    switch (task) {
      case 'edit-room':
        actionBarContents = <AbRoomOverview {...routeProps} />
        break
      case 'edit-table':
        actionBarContents = <AbEditTable {...routeProps} />
        break
      case 'delete-table':
        actionBarContents = <AbDeleteTable {...routeProps} />
        break
      case 'offering-overview':
        actionBarContents = <AbOfferingOverview {...routeProps} />
        break
      case 'find-student':
        actionBarContents = <AbFindStudent {...routeProps} />
        break
      case 'student-details':
        actionBarContents = <AbStudentDetails {...routeProps} />
        break
      default:
        actionBarContents = null
    }

    return actionBarContents
  }

  render() {
    const { isFloating } = this.state
    const { currentOffering } = this.props

    const actionBarContainerClasses = classNames({
      'action-bar-container': true,
      'is-floating': isFloating,
    })

    return (
      <div className={actionBarContainerClasses}>
        <Route path="/room/:roomId/:offeringId?" render={routeProps => this.getActionBarContents(routeProps)} />
        {currentOffering && currentOffering.students && (
          <Route path="/offering/:offeringId/" render={routeProps => this.getActionBarContents(routeProps)} />
        )}
      </div>
    )
  }
}

const mapStateToProps = ({ app, entities }, { match }) => {
  const { task, bannerHeight } = app
  return {
    bannerHeight,
    currentOffering: entities.offerings[match.params.offeringId] || null,
    task,
  }
}

export default connect(mapStateToProps)(ActionBar)
