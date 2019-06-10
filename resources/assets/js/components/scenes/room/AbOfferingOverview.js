/* eslint-disable no-nested-ternary */
/* eslint-disable react/button-has-type */
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  setTask,
  customizeOfferingRoom,
  setView,
  setModal,
} from '../../../actions'

class AbOfferingOverview extends Component {
  handlePrintButtonClick() {
    const { dispatch } = this.props
    dispatch(setModal('print-room', true))
  }

  handleEditRoomClick() {
    const {
      dispatch,
      currentRoom,
      currentOffering,
      history,
    } = this.props

    // If we need to redirect to a newly created room, we'll use this function.
    function navigateToNewRoomEditPage(roomId) {
      history.push(`/room/${roomId}/${currentOffering.id}`)
    }

    // is the room already 'customized?
    if (currentRoom.type === 'template') {
      // create a duplicate room, transfer over all the students to
      // equivalent tables in the new room, and pass in our edit new room function.
      dispatch(setTask('edit-room'))
      dispatch(setView('edit-room'))
      dispatch(customizeOfferingRoom(currentOffering.id, navigateToNewRoomEditPage))
    } else {
      dispatch(setTask('edit-room'))
      dispatch(setView('edit-room'))
      history.push(`/room/${currentRoom.id}/${currentOffering.id}`)
    }
  }

  handleEditEnrollmentClick() {
    const { dispatch } = this.props
    dispatch(setModal('edit-enrollment', true))
  }

  render() {
    const { currentOffering, currentStudents } = this.props
    const unseatedStudents = currentStudents.filter(student => student.enrollment[`offering_${currentOffering.id}`].seat === null)

    return (
      <div className="action-bar action-bar-offering-overview">

        <div className="left" />

        <div className="center">
          <div className="click-an-empty-seat">
            <svg className="empty-seat-icon" width="40" height="40" viewBox="0 0 40 40">
              <rect width="40" height="40" />
              <g className="plus-person" transform="translate(9, 9)">
                <path d="M15,12 C17.21,12 19,10.21 19,8 C19,5.79 17.21,4 15,4 C12.79,4 11,5.79 11,8 C11,10.21 12.79,12 15,12 Z M6,10 L6,7 L4,7 L4,10 L1,10 L1,12 L4,12 L4,15 L6,15 L6,12 L9,12 L9,10 L6,10 Z M15,14 C12.33,14 7,15.34 7,18 L7,20 L23,20 L23,18 C23,15.34 17.67,14 15,14 Z" />
              </g>
            </svg>
            <p>{currentStudents.length
              ? unseatedStudents.length
                ? 'Click an empty seat to place a student'
                : 'All students have been seated'
              : 'Doesn\'t look like anyone is enrolled right now'}
            </p>
          </div>
        </div>

        <div className="right">
          <div className="offering-overview-controls">

            {/* Only show if a room is assigned */}
            {currentOffering.room_id !== null && (
              <button className="big-button" onClick={() => this.handleEditRoomClick()}>
                <FontAwesomeIcon icon={['far', 'wrench']} />
                <p>Edit Tables<br /> and Seats</p>
              </button>
            )}

            <button className="big-button" onClick={() => this.handleEditEnrollmentClick()}>
              <FontAwesomeIcon icon={['far', 'user-plus']} />
              <p>Find More<br /> Students</p>
            </button>

            <button className="big-button" onClick={() => this.handlePrintButtonClick()}>
              <FontAwesomeIcon icon={['far', 'print']} />
              <p>Create<br />Prints</p>
            </button>

          </div>
        </div>

      </div>
    )
  }
}

const mapStateToProps = ({ app, entities }, { match }) => {
  const currentOffering = entities.offerings[match.params.offeringId] || null
  const currentStudents = []
  if (currentOffering) {
    Object.keys(entities.students).forEach((studentId) => {
      if (currentOffering.students.includes(parseInt(studentId))) {
        currentStudents.push(entities.students[studentId])
      }
    })
  }

  return {
    currentOffering,
    currentStudents,
    currentRoom: app.currentRoom,
    task: app.task,
    loading: app.loading,
    view: app.view,
  }
}

export default withRouter(connect(mapStateToProps)(AbOfferingOverview))
