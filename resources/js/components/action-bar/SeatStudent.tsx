import React, { useState, useMemo, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { setTask, selectSeat } from '../../store/session/actions'
import IconButton from '../IconButton'
import styled from '../../utils/styledComponents'
import SearchInputContainer from '../SearchInputContainer'
import { AppState } from '../../store'
import { StudentsState } from '../../store/students/types'
import { Offering } from '../../store/offerings/types'
import useOutsideClickDetector from '../../hooks/useOutsideClickDetector'
import { assignSeat } from '../../store/enrollments/actions'
import { SessionState } from '../../store/session/types'
import { Enrollments } from '../../store/enrollments/types'
import useEscapeKeyListener from '../../hooks/useEscapeKeyListener'
import StudentThumbnail from '../seating-chart/StudentThumbnail'

const Container = styled('div')`
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  .search-input-container {
    margin: 0 1em;
    width: 15em;
  }
  ul {
    display: flex;
    justify-content: flex-start;
    margin: 0;
    height: inherit;
    overflow-x: auto;
    overflow-y: hidden;
    li {
      margin: 0;
      height: inherit;
      button {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: inherit;
        padding: 0.5em;
        transition: background 100ms ease-out, color 100ms ease-out;
        .student-thumbnail {
          height: 3em;
          width: 3em;
          margin-bottom: 0.25em;
          background-position: center;
          background-size: cover;
          border-radius: 5px;
        }
        p {
          display: block;
          margin: 0;
          font-size: ${(props) => props.theme.ms(-1)};
        }
        &:hover {
          color: white;
          background-color: ${(props) => props.theme.red};
        }
      }
    }
  }
  .all-seated {
    margin-left: 1em;
    font-style: italic;
    color: ${(props) => props.theme.middleGray};
  }
`

interface StoreProps {
  offering: Offering;
  students: StudentsState;
  enrollments: Enrollments;
  session: SessionState;
  assignSeat: typeof assignSeat;
  setTask: typeof setTask;
  selectSeat: typeof selectSeat;
}
interface OwnProps {
  actionBarRef: HTMLDivElement | null;
}
type Props = StoreProps & OwnProps & RouteComponentProps<{ offeringId: string }>

const SeatStudent = ({
  offering,
  students,
  enrollments,
  session,
  setTask,
  assignSeat,
  selectSeat,
  actionBarRef,
}: Props) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const filteredStudents = useMemo(() => Object.keys(enrollments)
    .filter((studentId) => enrollments[studentId].seat === null)
    .filter((studentId) => {
      const student = students[studentId]
      const nameConcat = student.short_first_name
        + student.short_last_name
        + student.first_name
        + student.last_name
        + student.middle_name
        + student.nickname
        + student.cnet_id
      if (query === '') return true
      if (nameConcat.toUpperCase().includes(query.toUpperCase())) return true
      return false
    })
    .sort((a, b) => (students[a].last_name > students[b].last_name ? 1 : -1))
    .map((studentId) => students[studentId]), [enrollments, students, query])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
  }

  function reset() {
    setTask(null)
    selectSeat(null)
  }

  useOutsideClickDetector(actionBarRef, reset)
  useEscapeKeyListener(reset)

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  })

  function handleStudentClick(studentId: string) {
    if (session.selectedSeat) {
      assignSeat(offering.id, studentId, session.selectedSeat)
    }
  }

  return (
    <Container>
      <IconButton icon={['far', 'arrow-left']} handler={reset} />
      <SearchInputContainer>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Name, CNet ID..."
          ref={inputRef}
        />
      </SearchInputContainer>
      {filteredStudents.length > 0 && (
        <ul>
          {filteredStudents.map((student) => (
            <li key={student.id}>
              <button type="button" onClick={() => handleStudentClick(student.id)}>
                <StudentThumbnail student={student} />
                <p>{student.short_first_name} {student.short_last_name}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
      {filteredStudents.length === 0 && query.length > 0 && (
        <p className="all-seated">Nothing found with "{query}"</p>
      )}
      {filteredStudents.length === 0 && query.length === 0 && (
        <p className="all-seated">All students seated!</p>
      )}
    </Container>
  )
}

const mapState = ({
  offerings,
  students,
  enrollments,
  session,
}: AppState, { match }: RouteComponentProps<{ offeringId: string }>) => ({
  offering: offerings[match.params.offeringId],
  students,
  enrollments: enrollments[match.params.offeringId],
  session,
})

export default withRouter(connect(mapState, {
  assignSeat,
  setTask,
  selectSeat,
})(SeatStudent))
