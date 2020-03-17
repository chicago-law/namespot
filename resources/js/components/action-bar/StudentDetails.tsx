import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AppState } from '../../store'
import { StudentsState } from '../../store/students/types'
import { SessionState } from '../../store/session/types'
import { setTask, selectStudent, selectSeat } from '../../store/session/actions'
import useOutsideClickDetector from '../../hooks/useOutsideClickDetector'
import IconButton from '../IconButton'
import styled from '../../utils/styledComponents'
import StudentThumbnail from '../seating-chart/StudentThumbnail'
import ActionBarButton from './ActionBarButton'
import { assignSeat, deleteEnrollment } from '../../store/enrollments/actions'
import ActionBarInfoColumn from './ActionBarInfoColumn'
import { EnrollmentsState } from '../../store/enrollments/types'
import { theme } from '../../utils/theme'
import { ModalTypes } from '../../store/modal/types'
import { EditTextInputModalData } from '../modals/edit-text-input'
import { setModal } from '../../store/modal/actions'
import { updateStudent } from '../../store/students/actions'
import { ChangePictureModalData } from '../modals/change-picture'

const Container = styled('div')`
  display: flex;
  align-items: center;
  .thumbnail-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.6em 1em;
    width: 8em;
    height: 100%;
    cursor: pointer;
    button {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      opacity: 0;
      transform: translateY(1em);
      transition: opacity 150ms ease-out, transform 150ms ease-out;
      .fa-camera {
        position: absolute;
        color: ${(props) => props.theme.red};
        font-size: ${(props) => props.theme.ms(2)};
      }
    }
    .student-thumbnail {
      border-radius: 10px;
      line-height: 0;
      transition: opacity 150ms ease-out;
    }
    &:hover {
      button {
        opacity: 1;
        transform: translateY(0);
      }
      .student-thumbnail {
        opacity: 0.5;
      }
    }
  }
  .student-info {
    margin-right: auto;
  }
`

interface StoreProps {
  students: StudentsState;
  enrollments: EnrollmentsState;
  session: SessionState;
  assignSeat: typeof assignSeat;
  setTask: typeof setTask;
  selectStudent: typeof selectStudent;
  selectSeat: typeof selectSeat;
  deleteEnrollment: typeof deleteEnrollment;
  setModal: typeof setModal;
  updateStudent: typeof updateStudent;
}
interface OwnProps {
  actionBarRef: HTMLDivElement | null;
}

const StudentDetails = ({
  students,
  enrollments,
  session,
  assignSeat,
  setTask,
  selectStudent,
  selectSeat,
  deleteEnrollment,
  setModal,
  updateStudent,
  actionBarRef,
  match,
}: StoreProps & OwnProps & RouteComponentProps<{ offeringId: string }>) => {
  const { offeringId } = match.params
  const student = (session.selectedStudent && students[session.selectedStudent]) || null
  const enrollment = (student && enrollments[offeringId] && enrollments[offeringId][student.id]) || null

  function closeAndReset() {
    setTask(null)
    selectStudent(null)
    selectSeat(null)
  }

  function handleUnseat() {
    if (student) assignSeat(offeringId, student.id, null)
    closeAndReset()
  }

  function handleRemoveFromClass() {
    if (student) deleteEnrollment(offeringId, student.id)
    closeAndReset()
  }

  function handleEditNickname() {
    if (student) {
      setModal<EditTextInputModalData>(ModalTypes.editTextInput, {
        title: 'Edit Seating Chart Nickname',
        previousValue: student.nickname ? student.nickname : '',
        onConfirm: (text: string) => updateStudent(student.id, {
          nickname: text,
        }),
      })
    }
  }

  function handleEditPrefix() {
    if (student) {
      setModal<EditTextInputModalData>(ModalTypes.editTextInput, {
        title: 'Edit Name Prefix',
        previousValue: student.prefix ? student.prefix : '',
        onConfirm: (text: string) => updateStudent(student.id, {
          prefix: text,
        }),
      })
    }
  }

  function handleChangePicture(studentId: string) {
    setModal<ChangePictureModalData>(ModalTypes.changePicture, {
      studentId,
    })
  }

  useOutsideClickDetector(actionBarRef, () => {
    closeAndReset()
  })

  return (
    <Container>
      <IconButton icon={['far', 'arrow-left']} handler={closeAndReset} />
      {student && enrollment && (
        <>
          <div className="thumbnail-container">
            <StudentThumbnail student={student} />
            <button type="button" onClick={() => handleChangePicture(student.id)}>
              <FontAwesomeIcon icon={['fas', 'camera']} />
            </button>
          </div>
          <div className="student-info">
            <ActionBarInfoColumn>
              <>
                <h5>Full Name</h5>
                <p>
                  {student.first_name} {student.middle_name} {student.last_name}
                </p>
                <h5>Preferred Name</h5>
                <p>
                  {student.short_first_name} {student.short_last_name}
                </p>
              </>
            </ActionBarInfoColumn>
            <ActionBarInfoColumn>
              <>
                <h5>Seating Chart Nickname</h5>
                <p>
                  {student.nickname ? student.nickname : '(none set)'}
                  <IconButton
                    icon={['far', 'pencil']}
                    handler={handleEditNickname}
                    iconSize={0}
                    iconColor={theme.red}
                  />
                </p>
                <h5>Name Prefix</h5>
                <p>
                  {student.prefix ? student.prefix : '(none set)'}
                  <IconButton
                    icon={['far', 'pencil']}
                    handler={handleEditPrefix}
                    iconSize={0}
                    iconColor={theme.red}
                  />
                </p>
              </>
            </ActionBarInfoColumn>
            <ActionBarInfoColumn>
              <>
                <h5>Enrollment Sources</h5>
                <p>
                  AIS Status: {enrollment.is_in_ais === 1 ? 'enrolled' : 'not found'}
                  <br />
                  Canvas Status: {enrollment.canvas_enrollment_state !== null
                    ? enrollment.canvas_enrollment_state.split('_').join(' ')
                    : 'not found'}
                </p>
              </>
            </ActionBarInfoColumn>
          </div>
          {!!enrollment.is_namespot_addition && (
            <ActionBarButton
              icon={['far', 'user-times']}
              text="Remove From Class"
              handler={handleRemoveFromClass}
            />
          )}
          {enrollment.seat && (
            <ActionBarButton
              icon={['far', 'unlink']}
              text="Remove From Seat"
              handler={handleUnseat}
            />
          )}
        </>
      )}
    </Container>
  )
}

const mapState = ({ students, enrollments, session }: AppState) => ({
  students,
  enrollments,
  session,
})

export default withRouter(connect(mapState, {
  assignSeat,
  setTask,
  selectStudent,
  selectSeat,
  deleteEnrollment,
  setModal,
  updateStudent,
})(StudentDetails))
