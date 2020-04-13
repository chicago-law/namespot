import React, { useLayoutEffect, useRef, useCallback } from 'react'
import { connect, useDispatch } from 'react-redux'
import styled from '../utils/styledComponents'
import { AppState } from '../store'
import { Enrollments } from '../store/enrollments/types'
import { StudentsState } from '../store/students/types'
import assembleNameTents from '../utils/assembleNameTents'
import { Offering } from '../store/offerings/types'
import { exitPrint, updatePrintProgress } from '../store/printing/actions'
import C from '../utils/constants'

const Container = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999999;
  .name-tent {
    position: relative;
    width: ${C.letterWidth}in;
    height: ${C.letterHeight}in;
    background: white;
    .name {
      position: absolute;
      left: 0.5in;
      right: 0.5in;
      bottom: 1.25in;
      text-align: center;
      span {
        font-size: 120px;
      }
    }
  }
`

interface OwnProps {
  offeringId: string;
}
interface StoreProps {
  offering: Offering;
  students: StudentsState;
  enrollments: Enrollments;
}

const NameTents = ({
  offering,
  students,
  enrollments,
}: StoreProps) => {
  const tentRefs = useRef<(HTMLDivElement | null)[]>([])
  const dispatch = useDispatch()

  const checkNameSize = useCallback((tent: HTMLDivElement) => {
    // The max distance a name element can be from top of page is the page's halfway point,
    // plus a little more since the text doesn't start right at the point that offsetTop
    // measures from (line height and such).
    const maxTop = (parseFloat(window.getComputedStyle(tent).getPropertyValue('height')) / 2) + 25
    const name = tent.querySelector('.name') as HTMLDivElement
    const currentTop = name.offsetTop

    // If it's too close to the top of the page, shrink font size by 5 px and
    // try again.
    if (currentTop < maxTop) {
      const span = name.querySelector('span') as HTMLSpanElement
      const currentSize = parseFloat(window.getComputedStyle(span).getPropertyValue('font-size'))
      const newSize = currentSize - 5
      span.style.fontSize = `${newSize}px`
      checkNameSize(tent)
    }

    return true
  }, [])

  useLayoutEffect(() => {
    function updateProgress(progress: string) {
      dispatch(updatePrintProgress(progress))
    }

    function createPdf() {
      const tents = tentRefs.current.filter(tent => tent !== null)
      assembleNameTents(
        tents as HTMLDivElement[],
        offering,
        updateProgress,
        () => dispatch(exitPrint()),
      )
    }

    tentRefs.current.forEach(tent => (tent ? checkNameSize(tent) : false))
    createPdf()
  }, [checkNameSize, dispatch, offering])

  return (
    <Container id="name-tents-container">
      {Object.keys(enrollments).map(studentId => (
        <div className="name-tent" key={studentId} ref={ref => { if (!tentRefs.current.includes(ref)) tentRefs.current.push(ref) }}>
          <div className="name">
            <span>
              {students[studentId].short_first_name} {students[studentId].short_last_name}
            </span>
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
}: AppState, { offeringId }: OwnProps) => ({
  offering: offerings[offeringId],
  students,
  enrollments: enrollments[offeringId] || {},
})

export default connect(mapState)(NameTents)
