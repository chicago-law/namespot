import React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from '../../utils/styledComponents'
import { Offering } from '../../store/offerings/types'
import { AppState } from '../../store'
import { StudentsState } from '../../store/students/types'
import { RoomsState } from '../../store/rooms/types'
import { SeatsState } from '../../store/seats/types'
import StudentThumbnail from './StudentThumbnail'
import { Enrollments } from '../../store/enrollments/types'
import { setTask, selectStudent, selectSeat } from '../../store/session/actions'
import animateEntrance from '../../utils/animateEntrance'

const Container = styled('div')`
  padding: 0 0 0 1.5em;
  text-align: right;
  ${animateEntrance('slideLeft')};
  ul, li {
    margin: 0 0 1.5em 0;
  }
  li {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: ${(props) => props.theme.middleGray};
    h5 {
      margin: 0.5em 0;
    }
    svg {
      margin-left: 0.5em;
      font-size: ${(props) => props.theme.ms(2)};
      @media(max-width: ${(props) => props.theme.break.medium}) {
        display: none;
      }
    }
  }

  .thumbnail-container {
    display: inline-block;
    width: 1.35em;
    .student-thumbnail {
      max-width: none;
      width: 2em;
      height: 2em;
      overflow: hidden;
      border-radius: 10px;
      border: 3px solid ${(props) => props.theme.offWhite};
    }
  }
`

interface StoreProps {
  offering: Offering;
  students: StudentsState;
  enrollments: Enrollments;
  rooms: RoomsState;
  seats: SeatsState;
  setTask: typeof setTask;
  selectStudent: typeof selectStudent;
  selectSeat: typeof selectSeat;
}
interface RouteParams {
  offeringId: string;
}

const OfferingSidebarRight = ({
  offering,
  students,
  enrollments,
  rooms,
  seats,
  setTask,
  selectStudent,
  selectSeat,
}: StoreProps & RouteComponentProps<RouteParams>) => {
  const room = offering.room_id ? rooms[offering.room_id] : null
  const currentSeats = room ? seats[room.id] : null
  const seatCount = (room && currentSeats) ? Object.keys(currentSeats).length : null
  const seatedStudents: string[] = []
  const notSeatedStudents: string[] = []

  Object.keys(students)
    .filter((studentId) => enrollments[studentId])
    .forEach((studentId) => {
      const enrollment = enrollments[studentId]
      if (enrollment.seat !== null) {
        seatedStudents.push(studentId)
      } else {
        notSeatedStudents.push(studentId)
      }
    })

  function handleStudentClick(e: React.MouseEvent, studentId: string) {
    e.stopPropagation()
    setTask('student-details')
    selectStudent(studentId)
    const enrollment = enrollments[studentId]
    if (enrollment && enrollment.seat !== null) selectSeat(enrollment.seat)
  }

  return (
    <Container>
      <ul>
        <li>
          <h5>
            {room && (room.name !== null
              ? room.name
              : '(untitled room)')}
            {room && room.type === 'custom' && ' (edited)'}
            {!room && 'No Room Assigned'}
          </h5>
          <FontAwesomeIcon icon={['far', 'map-marker-alt']} fixedWidth />
        </li>
        {seatCount !== null && (
          <li>
            <h5>
              {Object.keys(enrollments).length} students enrolled, with {seatCount} seats in room.
            </h5>
            <FontAwesomeIcon icon={['far', 'users']} fixedWidth />
          </li>
        )}

        {seatedStudents.length > 0 && (
          <li>
            <div>
              <h5>Seated:</h5>
              {seatedStudents.map((studentId) => (
                <div className="thumbnail-container" key={studentId}>
                  <StudentThumbnail
                    student={students[studentId]}
                    onClick={(e: React.MouseEvent) => handleStudentClick(e, studentId)}
                  />
                </div>
              ))}
            </div>
          </li>
        )}

        {notSeatedStudents.length > 0 && (
          <li>
            <div>
              <h5>Not Seated:</h5>
              {notSeatedStudents.map((studentId) => (
                <div className="thumbnail-container" key={studentId}>
                  <StudentThumbnail
                    key={studentId}
                    student={students[studentId]}
                    onClick={(e) => handleStudentClick(e, studentId)}
                  />
                </div>
              ))}
            </div>
          </li>
        )}
      </ul>
    </Container>
  )
}

const mapState = ({
  offerings,
  students,
  enrollments,
  rooms,
  seats,
}: AppState, {
  match,
}: RouteComponentProps<RouteParams>) => ({
  offering: offerings[match.params.offeringId],
  students,
  enrollments: enrollments[match.params.offeringId],
  rooms,
  seats,
})

export default withRouter(connect(mapState, {
  setTask,
  selectStudent,
  selectSeat,
})(React.memo(OfferingSidebarRight)))
