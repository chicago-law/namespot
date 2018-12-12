import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import helpers from '../../bootstrap'

export default class Seat extends Component {
    handleSeatClick(e) {
    // first check if we're in the only view where we care about seat clicks
    if (this.props.view === 'assign-seats') {
      // then check to see if there are actually students in the class
      if (this.props.currentOffering.students.length > 0) {
        // now check if the seat is occupied or not
        const occupied = e.target.closest('.seat').classList.contains('is-occupied')
        if (occupied) {
          switch (this.props.task) {
            case 'offering-overview':
            case 'find-student':
              this.props.setTask('student-details')
              // Note: IE can't handle data attributes on SVG, apparently...
              this.props.setCurrentStudentId(parseInt(e.target.closest('.is-occupied').getAttribute('data-studentid')))
              break
            case 'student-details':
              this.props.setCurrentStudentId(parseInt(e.target.closest('.is-occupied').getAttribute('data-studentid')))
              break
          }
        }
        else { // seat is not occupied
          switch (this.props.task) {
            case 'offering-overview':
              this.props.setTask('find-student')
              this.props.setCurrentSeatId(e.target.closest('.seat-container').getAttribute('data-seatid'))
              break
            case 'find-student':
              this.props.setCurrentSeatId(e.target.closest('.seat-container').getAttribute('data-seatid'))
              break
            case 'student-details':
              this.props.setTask('find-student')
              this.props.setCurrentSeatId(e.target.closest('.seat-container').getAttribute('data-seatid'))
              break
          }
        }
      } else {
        // empty class!
        this.props.requestError('no-students', 'There are no students in the class to seat!', true)
      }
    }
    e.stopPropagation() // so that click doesn't bubble up to being a "background" click
  }

  adjustedSeatSize() {
    // First, double the seat size since we're doubling the paper size
    // to crank up the resolution.
    // Then we'll shrink them a little bit to compensate if page size is set to letter.
    // If you add more pages sizes in the future, you can make more here as necessary
    const size = this.props.currentRoom.seat_size
    switch (this.props.currentOffering.paper_size) {
      case 'tabloid':
        return size * 2
      case 'letter':
        return (size * 2) * 0.6
      default:
        return size * 2
    }
  }

  createSeat() {
    const { currentOffering, currentStudentId, id, students, view, withStudents } = this.props
    const seatPictureStyles = {
      'height': `${this.adjustedSeatSize()}px`,
      'width': `${this.adjustedSeatSize()}px`,
    }

    let theSeat
    const occupantId = Object.keys(students).find(studentId =>
      students[studentId].enrollment[`offering_${currentOffering.id}`]
      && students[studentId].enrollment[`offering_${currentOffering.id}`].seat
      && students[studentId].enrollment[`offering_${currentOffering.id}`].seat === id
    )

    // check if we are in a view where you want to see occupants if they're there
    if (
      (view === 'assign-seats' || view === 'seating-chart')
      && withStudents === true
    ) {
      if (occupantId) { // seat is occupied, show the student
        const occupant = students[occupantId]
        const occupiedSeatClasses = classNames({
          'seat': true,
          'is-occupied': true,
          'is-current-student': currentStudentId == occupantId,
          'font-smaller': currentOffering.font_size === 'smaller',
          'font-larger': currentOffering.font_size === 'larger',
          'font-largest': currentOffering.font_size === 'x-large',
        })

        theSeat = (
          <div className={occupiedSeatClasses} data-studentid={occupantId}>
            <div className='picture' style={{
              'backgroundImage': `url('${helpers.rootUrl}storage/student_pictures/${occupant.picture}')`,
              'height': `${this.adjustedSeatSize()}px`,
              'width': `${this.adjustedSeatSize()}px`,
            }}>
            </div>
            <p className='name'>

              {/* First Name */}
              {(
                currentOffering.names_to_show === 'first_and_last'
                || currentOffering.names_to_show === 'first_and_last_initial'
                || currentOffering.names_to_show === 'first_only'
                || currentOffering.names_to_show === null
              ) && (
                <span className='first'>
                  {occupant.nickname && (currentOffering.use_nicknames == true || currentOffering.use_nicknames === null)
                    ? occupant.nickname
                    : occupant.short_first_name
                      ? occupant.short_first_name
                      : occupant.first_name
                  }
                </span>
              )}

              {/* Last Name */}
              {(
                currentOffering.names_to_show === 'first_and_last'
                || currentOffering.names_to_show === 'last_only'
                || currentOffering.names_to_show === null
              ) && (
                <span className='last'>
                  {occupant.short_last_name
                    ? occupant.short_last_name
                    : occupant.last_name
                  }
                </span>
              )}
              {(
                currentOffering.names_to_show === 'first_and_last_initial'
              ) && (
                <span className='last'>
                  {`${occupant.last_name.charAt(0)}.`}
                </span>
              )}

            </p>
          </div>
        )
      } else {
        if (view === 'assign-seats') { // Seat that's empty and fillable, shows user "+" version
          theSeat = (
            <div className='seat fillable-seat'>
              <div className='picture' style={seatPictureStyles}>
                <svg xmlns="http://www.w3.org/2000/svg" xlinkHref="http://www.w3.org/1999/xlink" viewBox={'0 0 40 40'} height='100%' width='100%'>
                  <rect width="40" height="40" fill="#CCCCCC"></rect>
                  <g className="plus-person" transform="translate(9, 9)">
                    <path d="M15,12 C17.21,12 19,10.21 19,8 C19,5.79 17.21,4 15,4 C12.79,4 11,5.79 11,8 C11,10.21 12.79,12 15,12 Z M6,10 L6,7 L4,7 L4,10 L1,10 L1,12 L4,12 L4,15 L6,15 L6,12 L9,12 L9,10 L6,10 Z M15,14 C12.33,14 7,15.34 7,18 L7,20 L23,20 L23,18 C23,15.34 17.67,14 15,14 Z"></path>
                  </g>
                </svg>
              </div>
            </div>
          )
        } else { // seat that is just plain ol' empty, and we're not showing the fillable "+" version
          theSeat = (
            <div className='seat empty-seat'>
              <div className='picture' style={seatPictureStyles}></div>
            </div>
          )
        }
      }
    } else if (view === 'edit-room' || view === 'seating-chart') { // seat that is just plain ol' empty, and we're not showing the fillable "+" version
      theSeat = (
        <div className='seat empty-seat'>
          <div className='picture' style={seatPictureStyles}></div>
        </div>
      )
    }

    return theSeat
  }

  render() {
    const { currentOffering, currentSeatId, id, labelPosition, left, top } = this.props

    const seatContClasses = classNames({
      'seat-container':true,
      'is-active': currentSeatId === id,
      'label-below': (labelPosition === 'below' && currentOffering.flipped !== 1) || (labelPosition === 'above' && currentOffering.flipped === 1),
      'label-above': (labelPosition === 'above' && currentOffering.flipped !== 1) || (labelPosition === 'below' && currentOffering.flipped === 1),
      'label-left': (labelPosition === 'left' && currentOffering.flipped !== 1) || (labelPosition === 'right' && currentOffering.flipped === 1),
      'label-right': (labelPosition === 'right' && currentOffering.flipped !== 1) || (labelPosition === 'left' && currentOffering.flipped === 1),
    })

    return (
      <div
        className={seatContClasses}
        data-seatid={this.props.id}
        onClick={(e) => this.handleSeatClick(e)}
        style={{
          'left': `${left}px`,
          'top': `${top}px`,
          'height': `${this.adjustedSeatSize()}px`,
          'width': `${this.adjustedSeatSize()}px`,
          'transform': `translate(-${this.adjustedSeatSize() / 2}px, -${this.adjustedSeatSize() / 2}px)`
        }}
      >
        {this.createSeat()}
      </div>
    )
  }
}

Seat.propTypes = {
  currentOffering: PropTypes.object.isRequired,
  currentRoom: PropTypes.object.isRequired,
  currentSeatId: PropTypes.string,
  currentStudentId: PropTypes.number,
  id: PropTypes.string.isRequired,
  labelPosition: PropTypes.string.isRequired,
  left: PropTypes.string.isRequired,
  removeError: PropTypes.func.isRequired,
  requestError: PropTypes.func.isRequired,
  seats: PropTypes.object.isRequired,
  setCurrentSeatId: PropTypes.func.isRequired,
  setCurrentStudentId: PropTypes.func.isRequired,
  setTask: PropTypes.func.isRequired,
  students: PropTypes.object.isRequired,
  task: PropTypes.string.isRequired,
  top: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  withStudents: PropTypes.bool.isRequired
}