import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import helpers from '../../../bootstrap'
import { setTask, setCurrentStudentId } from '../../../actions'

class OfferingDetails extends Component {
  handleStudentClick(e) {
    const { dispatch } = this.props
    e.stopPropagation()
    dispatch(setCurrentStudentId(parseInt(e.target.getAttribute('studentid'))))
    dispatch(setTask('student-details'))
  }

  render() {
    const {
      currentOffering,
      currentRoom,
      currentSeats,
      currentStudents,
    } = this.props
    const students = currentStudents.map(student => (
      <li key={student.id}>
        <button
          type="button"
          studentid={student.id}
          className="picture"
          style={{ backgroundImage: `url('${helpers.rootUrl}storage/student_pictures/${student.picture}')` }}
          title={`${student.first_name} ${student.last_name}`}
          seated={student.enrollment[`offering_${currentOffering.id}`].seat !== null ? 'true' : 'false'}
          onClick={e => this.handleStudentClick(e)}
        />
      </li>
    ))
    const seatedStudents = students.filter(student => student.props.children.props.seated === 'true')
    const unseatedStudents = students.filter(student => student.props.children.props.seated === 'false')

    return (
      <div className="offering-details">
        <div className="offering-details__room-details">
          {currentOffering.room_id !== null
            ? (
              <p className="location">
                <FontAwesomeIcon icon={['fas', 'map-marker-alt']} />
                Located in {currentRoom.type === 'template' ? currentRoom.name : `${currentRoom.name} (edited)`}
              </p>
            ) : (
              <p className="location">
                <FontAwesomeIcon icon={['fas', 'map-marker-alt']} />
                No room set
              </p>
            )
          }
          <p className="enrollment">
            <FontAwesomeIcon icon={['far', 'users']} />&nbsp;
            {currentSeats.length} seats in room, with&nbsp;
            {currentOffering.students.length} students enrolled
          </p>
        </div>
        <div className="offering-details__roster-gallery">
          {seatedStudents.length > 0 && (
            <div className="seated">
              <p>Seated:</p>
              <ul>
                {seatedStudents.length
                  ? seatedStudents
                  : (
                    <li>
                      <p style={{ position: 'relative', left: '-.15em' }}>(none)</p>
                    </li>
                )}
              </ul>
            </div>
          )}
          {unseatedStudents.length > 0 && (
            <div className="unseated">
              <p>Not Seated:</p>
              <ul>
                {unseatedStudents.length
                  ? unseatedStudents
                  : (
                    <li>
                      <p style={{ position: 'relative', left: '-.15em' }}>(none)</p>
                    </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ app, entities }) => {
  const { tables, students } = entities

  // get the students enrolled in this class
  const currentStudents = Object.keys(students)
    .filter(id => app.currentOffering.students.includes(parseInt(id)))
    .map(id => students[id])
    .sort((a, b) => (b.last_name.toUpperCase() < a.last_name.toUpperCase() ? 1 : -1))

  // get the tables for the current room
  const currentTables = Object.keys(tables)
    .filter(id => parseFloat(tables[id].room_id) === parseFloat(app.currentOffering.room_id))
    .map(id => tables[id])

  // make an array of all the seat IDs at the tables
  const currentSeats = []
  currentTables.forEach((table) => {
    for (let i = 0; i < table.seat_count; i++) {
      currentSeats.push(`${table.id}_${i}`)
    }
  })

  return {
    currentOffering: app.currentOffering,
    currentRoom: app.currentRoom,
    currentSeats,
    currentStudents,
  }
}

export default connect(mapStateToProps)(OfferingDetails)
