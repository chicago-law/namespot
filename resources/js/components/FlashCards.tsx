import React, { useRef, useLayoutEffect, Fragment, useCallback } from 'react'
import { connect } from 'react-redux'
import styled from '../utils/styledComponents'
import { AppState } from '../store'
import { Offering } from '../store/offerings/types'
import { StudentsState } from '../store/students/types'
import { EnrollmentsState } from '../store/enrollments/types'
import StudentThumbnail from './seating-chart/StudentThumbnail'
import { termCodeToString } from '../utils/helpers'
import { PrintingState } from '../store/printing/types'
import assembleFlashCards from '../utils/assembleFlashCards'
import { exitPrint, updatePrintProgress } from '../store/printing/actions'

const flashCardScale = 2

const Container = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999999;
  .card {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 3in;
    width: 5in;
    background: white;
    &.same-side {
      >div {
        position: relative;
        flex: 0 0 50%;
      }
    }
  }
  .picture-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: inherit;
    width: 50%;
    .student-thumbnail {
      position: absolute;
      top: 0;
      left: 0;
      height: ${100 * flashCardScale}%;
      width: ${100 * flashCardScale}%;
      transform-origin: top left;
      transform: scale(${1 / flashCardScale});
    }
  }
  .info-container {
    text-align: center;
    padding: 0 0.5em;
  }
`

interface StoreProps {
  offering: Offering;
  students: StudentsState;
  enrollments: EnrollmentsState;
  printing: PrintingState;
  updatePrintProgress: typeof updatePrintProgress;
  exitPrint: typeof exitPrint;
}
interface OwnProps {
  offeringId: string;
}

const FlashCards = ({
  offering,
  students,
  enrollments,
  printing,
  updatePrintProgress,
  exitPrint,
}: StoreProps) => {
  const cardsRef = useRef<HTMLDivElement[]>([])
  const currentStudents = Object.keys(students)
    .filter((studentId) => studentId in enrollments[offering.id])
    .map((studentId) => students[studentId])
    .sort((a, b) => (a.last_name > b.last_name ? 1 : -1))

  const updateProgress = useCallback((progress: string) => {
    return updatePrintProgress(progress)
  }, [updatePrintProgress])

  const createPdf = useCallback(() => {
    return assembleFlashCards(
      cardsRef.current,
      offering,
      printing.options.namesOnReverse || false,
      updateProgress,
      exitPrint,
    )
  }, [exitPrint, offering, printing.options.namesOnReverse, updateProgress])

  useLayoutEffect(() => {
    setTimeout(() => {
      createPdf()
    }, 100)
  }, [createPdf])

  return (
    <Container>
      {!printing.options.namesOnReverse && (
        currentStudents.map((student) => (
          <div
            className="card same-side"
            key={student.id}
            ref={(ref) => { if (ref && !cardsRef.current.includes(ref)) cardsRef.current.push(ref) }}
          >
            <div className="picture-container">
              <StudentThumbnail student={student} />
            </div>
            <div className="info-container">
              <h1>{`${student.short_first_name} ${student.short_last_name}`}</h1>
              <p>{offering.title}</p>
              <p>{termCodeToString(offering.term_code)}</p>
            </div>
          </div>
        ))
      )}
      {printing.options.namesOnReverse && (
        currentStudents.map((student) => (
          <Fragment key={student.id}>
            <div
              className="card"
              ref={(ref) => { if (ref && !cardsRef.current.includes(ref)) cardsRef.current.push(ref) }}
            >
              <div className="picture-container">
                <StudentThumbnail student={student} />
              </div>
            </div>
            <div
              className="card"
              ref={(ref) => { if (ref && !cardsRef.current.includes(ref)) cardsRef.current.push(ref) }}
            >
              <div className="info-container">
                <h1>{`${student.short_first_name} ${student.short_last_name}`}</h1>
                <p>{offering.title}</p>
                <p>{termCodeToString(offering.term_code)}</p>
              </div>
            </div>
          </Fragment>
        ))
      )}
    </Container>
  )
}

const mapState = ({
  offerings,
  students,
  enrollments,
  printing,
}: AppState, {
  offeringId,
}: OwnProps) => ({
  offering: offerings[offeringId],
  students,
  enrollments,
  printing,
})

export default connect(mapState, {
  updatePrintProgress,
  exitPrint,
})(FlashCards)
