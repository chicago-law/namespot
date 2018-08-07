import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import AbRoomOverview from '../scenes/room/containers/AbRoomOverview'
import AbEditTable from '../scenes/room/containers/AbEditTable'
import AbDeleteTable from '../scenes/room/containers/AbDeleteTable'
import AbOfferingOverview from '../scenes/room/containers/AbOfferingOverview'
import AbFindStudent from '../scenes/room/containers/AbFindStudent'
import AbStudentDetails from '../scenes/room/containers/AbStudentDetails'

export default class ActionBar extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let actionBarContents
    const task = this.props.task
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
    return (
      <div className='action-bar-container'>
        <Route path={'/room/:roomID/'} render={() => actionBarContents} />
        <Route path={'/offering/:offeringID/'} render={() => actionBarContents} />
      </div>
    )
  }
}

ActionBar.propTypes = {
  task:PropTypes.string.isRequired
}