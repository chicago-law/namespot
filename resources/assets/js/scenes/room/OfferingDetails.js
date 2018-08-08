import React, { Component } from 'react'
import PropTypes from 'prop-types'
import helpers from '../../bootstrap'

export default class OfferingDetails extends Component {

  handleStudentClick(e) {
    this.props.setCurrentStudentId(parseInt(e.target.getAttribute('studentid')))
    this.props.setTask('student-details')
    e.stopPropagation()
  }

  render() {
    const { currentOffering, currentRoom, currentSeats, currentStudents } = this.props

    const students = currentStudents.map(student => {
      const pictureUrl = student.picture && student.picture.length ? `url('${helpers.rootUrl}images/students/${student.picture}')` : `url('${helpers.rootUrl}images/students/no-face.png')`
      return (
        <li key={student.id}>
          <div
            studentid={student.id}
            className='picture'
            style={{ 'backgroundImage': pictureUrl }}
            title={`${student.first_name} ${student.last_name}`}
            seated={student.seats['offering_' + currentOffering.id] != null ? 'true' : 'false'}
            onClick={(e) => this.handleStudentClick(e)}
          />
        </li>
    )})

    const seatedStudents = students.filter(student => student.props.children.props.seated === 'true' ? true : false)
    const unseatedStudents = students.filter(student => student.props.children.props.seated === 'false' ? true : false)

    return (
      <div className="offering-details">
        <div className="offering-details__room-details">
          <p className='location'><i className="far fa-map-marker-alt fa-fw"></i> Located in {currentRoom.type === 'template' ? currentRoom.name : `${currentRoom.name} (edited)`}</p>
          <p className='enrollment'><i className="far fa-users fa-fw"></i> {currentSeats.length} seats in room, with {currentOffering.students.length} students enrolled</p>
        </div>
        <div className='offering-details__roster-gallery'>
          { seatedStudents.length > 0 && (
            <div className="seated">
              <p>Seated:</p>
              <ul>
                { seatedStudents.length ? seatedStudents : <li><p style={{'position':'relative','left':'-.15em'}}>(none)</p></li>}
              </ul>
            </div>
          )}
          <div className="unseated">
            <p>Not Seated:</p>
            <ul>
              { unseatedStudents.length ? unseatedStudents : <li><p style={{'position':'relative','left':'-.15em'}}>(none)</p></li>}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

OfferingDetails.propTypes = {
  assignSeat: PropTypes.func.isRequired,
  currentRoom: PropTypes.object.isRequired,
  currentOffering: PropTypes.object.isRequired,
  currentSeats: PropTypes.array.isRequired,
  currentStudents: PropTypes.array.isRequired,
  setCurrentStudentId: PropTypes.func.isRequired,
  setTask: PropTypes.func.isRequired,
}