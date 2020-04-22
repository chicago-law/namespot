import React, { useRef, useMemo } from 'react'
import { connect, useDispatch } from 'react-redux'
import styled from '../utils/styledComponents'
import { OfferingsState } from '../store/offerings/types'
import { AppState } from '../store'
import { exitPrint, updatePrintProgress } from '../store/printing/actions'
import { termCodeToString } from '../utils/helpers'
import { StudentsState } from '../store/students/types'
import { EnrollmentsState } from '../store/enrollments/types'
import StudentThumbnail from './seating-chart/StudentThumbnail'
import assembleRoster from '../utils/assembleRoster'
import { PrintingState } from '../store/printing/types'
import useMountEffect from '../hooks/useMountEffect'

// How much do you want to scale things up for clarity?
const rosterScale = 4

// 8.5 x 11 piece of paper. 3 columns, 8 rows.
// 8.5in wide - 0.5in on each side, divided by 3 columns.
const columnWidth = 2.5
// 11in tall - 0.5in on top and bottom, divided by 8 rows.
const rowHeight = 1.25

const Container = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  background: white;
  width: 8.5in;
  z-index: 9999999;
  header {
    height: ${rowHeight * 2}in;
    width: ${columnWidth}in;
    h1 {
      margin: 0;
      font-size: ${props => props.theme.ms(0)};
    }
    span {
      display: block;
      font-size: ${props => props.theme.ms(-1.5)};
      &.date {
        font-size: ${props => props.theme.ms(-2)};
        font-style: italic;
        margin-top: 1em;
      }
    }
  }
  .roster-row {
    display: flex;
    align-items: center;
    border: 1px solid ${props => props.theme.lightGray};
    width: ${columnWidth}in;
    height: ${rowHeight}in;
    span {
      display: block;
      flex: auto;
      padding: 0 .5em;
      font-size: ${props => props.theme.ms(-1)};
      &.details {
        font-size: ${props => props.theme.ms(-2)};
        overflow-wrap: break-word;
        word-break: break-all
      }
    }
    /* We're using this as a container to blow up the thumbnail
    and then scale it back down, allowing for higher res exports. */
    .thumbnail-container {
      position: relative;
      flex: 0 0 50%;
      height: 100%;
    }
    .student-thumbnail {
      /* Twice as big, then scaled to half. */
      position: absolute;
      top: 0;
      left: 0;
      height: ${100 * rosterScale}%;
      width: ${100 * rosterScale}%;
      transform-origin: top left;
      transform: scale(${1 / rosterScale});
      img {
        max-height: 100%;
        width: auto;
        max-width: none;
      }
    }
  }
`

interface StoreProps {
  offerings: OfferingsState;
  students: StudentsState;
  enrollments: EnrollmentsState;
  printing: PrintingState;
}
interface OwnProps {
  offeringId?: string;
}

const Roster = ({
  offerings,
  students,
  enrollments,
  printing,
  offeringId,
}: StoreProps & OwnProps) => {
  const pageRef = useRef<HTMLDivElement>(null)
  const rowsRef = useRef<HTMLElement[]>([])
  const offering = (offeringId && offerings[offeringId]) || null
  const dispatch = useDispatch()

  const includedStudents = useMemo(() => {
    if (offering) { // Create offering roster
      return Object.keys(students)
        .filter(studentId => {
          if (enrollments[offering.id]) {
          // If student isn't in class, return false.
            if (!(studentId in enrollments[offering.id])) return false
            // Now we know student is in there, but if it's AIS only, check their enrollment reason.
            if (printing.options.aisOnly && !enrollments[offering.id][studentId].is_in_ais) return false
            // Otherwise, include them!
            return true
          }
          return false
        })
        .map(studentId => students[studentId])
        .sort((a, b) => (a.last_name > b.last_name ? 1 : -1))
    }
    if (printing.options.academicPlan && printing.options.gradTerm) { // Create student body roster
      return Object.keys(students)
        .filter(studentId => (
          // Include if matches academic program and the graduating term.
          students[studentId].academic_prog?.toUpperCase() === printing.options.academicPlan?.toUpperCase()
          && students[studentId].exp_grad_term === printing.options.gradTerm
        ))
        .map(studentId => students[studentId])
        .sort((a, b) => (a.last_name > b.last_name ? 1 : -1))
    }
    // If neither of those, something isn't working as expected. Return empty array.
    return []
  }, [enrollments, offering, printing.options, students])

  function updateProgress(progress: string) {
    dispatch(updatePrintProgress(progress))
  }

  function createPdf() {
    if (pageRef.current) {
      assembleRoster(
        pageRef.current,
        rowsRef.current,
        offering,
        undefined,
        updateProgress,
        () => dispatch(exitPrint()),
      )
    }
  }

  useMountEffect(() => {
    createPdf()
    return () => {
      dispatch(exitPrint())
    }
  })

  return (
    <Container ref={pageRef}>
      <header ref={ref => { if (ref && !rowsRef.current.includes(ref)) rowsRef.current.push(ref) }}>
        <h1>
          {offering && offering.title}
          {printing.options.academicPlan && `${printing.options.academicPlan.substr(2).toUpperCase()} students`}
        </h1>
        {offering && (
          <>
            <span><strong>{offering.subject} {offering.catalog_nbr}</strong></span>
            <span>Term: <strong>{termCodeToString(offering.term_code)}</strong></span>
            <span>Section: <strong>{offering.section}</strong></span>
            <span>
              Instructors:&nbsp;
              <strong>
                {offering.instructors.map(inst => `${inst.first_name} ${inst.last_name}`).join(', ')}
              </strong>
            </span>
          </>
        )}
        {printing.options.gradTerm && (
          <span>Expected Graduation: <strong>{termCodeToString(printing.options.gradTerm)}</strong></span>
        )}
        <span>Students Enrolled: <strong>{includedStudents.length}</strong></span>
        <span className="date">Printed {new Date().toLocaleDateString()}</span>
      </header>

      {includedStudents.map(student => (
        <div key={student.id} className="roster-row" ref={ref => { if (ref && !rowsRef.current.includes(ref)) rowsRef.current.push(ref) }}>
          <div className="thumbnail-container">
            <StudentThumbnail student={student} />
          </div>
          <div className="roster-row__info">
            <span>{student.short_first_name} {student.short_last_name}</span>
            <span className="details">{student.academic_prog_descr}</span>
            <span className="details">{`CNet: ${student.cnet_id}`}</span>
          </div>
        </div>
      ))}

    </Container>
  )
}

const mapState = ({
  offerings,
  students,
  enrollments,
  printing,
}: AppState) => ({
  offerings,
  students,
  enrollments,
  printing,
})

export default connect(mapState)(Roster)
