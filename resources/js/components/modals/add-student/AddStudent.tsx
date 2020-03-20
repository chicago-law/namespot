import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModalControls from '../ModalControls'
import ModalHeader from '../ModalHeader'
import { createEnrollment } from '../../../store/enrollments/actions'
import ModalContent from '../ModalContent'
import { AppState } from '../../../store'
import { SessionState } from '../../../store/session/types'
import { StudentsState, Student } from '../../../store/students/types'
import { EnrollmentsState } from '../../../store/enrollments/types'
import SearchInputContainer from '../../SearchInputContainer'
import styled from '../../../utils/styledComponents'
import api from '../../../utils/api'
import TextButton from '../../TextButton'
import { dismissModal } from '../../../store/modal/actions'

const ContentContainer = styled('div')`
  input {
    max-width: 20em;
  }
  .results-message {
    display: flex;
    align-items: center;
    margin-top: 1em;
    height: 3em;
    font-size: ${(props) => props.theme.ms(-1)};
    button {
      margin-left: 1em;
    }
  }
  .results {
    li {
      margin: 0.25em 0;
      button {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 0.5em;
        text-align: left;
        color: inherit;
        border-radius: 5px;
        transition: background 100ms ease-out;
        svg {
          margin-right: 1em;
        }
        .already-enrolled {
          display: inline-block;
          margin-left: 1em;
          color: ${(props) => props.theme.darkGray};
          font-size: ${(props) => props.theme.ms(-1)};
          font-style: italic;
        }
        &:hover {
          color: white;
          background: ${(props) => props.theme.red};
        }
        &:disabled {
          opacity: 0.35;
          color: inherit !important;
          background: none !important;
        }
      }
    }
  }
`

export interface AddStudentModalData {
  offeringId: string;
}
interface StoreProps {
  students: StudentsState;
  enrollments: EnrollmentsState;
  session: SessionState;
  createEnrollment: typeof createEnrollment;
  dismissModal: typeof dismissModal;
}
interface OwnProps {
  modalData: AddStudentModalData;
}

const AddStudent = ({
  students,
  enrollments,
  session,
  createEnrollment,
  dismissModal,
  modalData,
}: StoreProps & OwnProps) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{
    students: Student[];
    count: number;
  }>({
    students: [],
    count: 0,
  })
  const [allResults, setAllResults] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { offeringId } = modalData

  function search(query: string, getAllResults = false) {
    api.searchStudents({
      query,
      limit: getAllResults ? undefined : 10,
    })
      .then(({ data }) => {
        setResults({
          students: data.students,
          count: data.count,
        })
      })
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    setQuery(value)
    if (allResults) setAllResults(false)
    if (value.length) {
      search(value)
    } else {
      setResults({
        students: [],
        count: 0,
      })
    }
  }

  function handleAllResults() {
    setAllResults(true)
    search(query, true)
  }

  function handleSelect(studentId: string) {
    createEnrollment(offeringId, studentId)
    dismissModal()
  }

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  return (
    <>
      <ModalHeader title="Add Student" />

      <ModalContent>
        <ContentContainer>
          <p>If for some reason a student is not enrolled in this class through Canvas or AIS, then they will not show up here in the class.</p>
          <p>In this case, you can manually add a student to a class when necessary by searching all Law students below.</p>
          <SearchInputContainer>
            <input
              type="text"
              ref={inputRef}
              placeholder="Student name or ID..."
              value={query}
              onChange={handleChange}
            />
          </SearchInputContainer>
          <div className="results-message">
            {query.length > 0 && (
              <>
                {results.count > 0 && results.count <= 10 && (
                  <span>Found {results.count} result{results.count !== 1 && 's'}.</span>
                )}
                {results.count > 10 && !allResults && (
                  <span>Showing first 10 of {results.count} results.</span>
                )}
                {allResults && (
                  <span>Showing all {results.count} results.</span>
                )}
                {results.count === 0 && (
                  <span>No results found with '{query}'.</span>
                )}
                {results.count > 10 && !allResults && (
                  <TextButton
                    text="Show All Results"
                    clickHandler={handleAllResults}
                    variant="clear"
                  />
                )}
              </>
            )}
          </div>
          <ul className="results">
            {results.students.map((student) => (
              <li key={student.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(student.id)}
                  disabled={student.id in enrollments[offeringId]}
                >
                  {student.id in enrollments[offeringId]
                    ? <FontAwesomeIcon icon={['far', 'check-circle']} fixedWidth />
                    : <FontAwesomeIcon icon={['far', 'user-plus']} fixedWidth />}
                  {student.short_first_name} {student.short_last_name}
                  {student.id in enrollments[offeringId] && (
                    <span className="already-enrolled">Already Enrolled</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </ContentContainer>
      </ModalContent>

      <ModalControls
        cancelOnly
        returnKeyConfirms={false}
      />
    </>
  )
}

const mapState = ({
  students,
  enrollments,
  session,
}: AppState) => ({
  students,
  enrollments,
  session,
})

export default connect(mapState, {
  createEnrollment,
  dismissModal,
})(AddStudent)
