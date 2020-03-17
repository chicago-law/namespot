import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from '../../utils/styledComponents'
import ActionBarButton from './ActionBarButton'
import PersonAdd from '../../../images/person-add.png'
import { AppState } from '../../store'
import { Offering } from '../../store/offerings/types'
import { RoomsState } from '../../store/rooms/types'
import { createRoom } from '../../store/rooms/actions'
import { setModal } from '../../store/modal/actions'
import { ModalTypes } from '../../store/modal/types'
import { PrintOfferingModalData } from '../modals/print-offering'
import { AddStudentModalData } from '../modals/add-student'
import { ChangeRoomModalData } from '../modals/change-room'
import { Enrollments } from '../../store/enrollments/types'

const Container = styled('div')`
  display: flex;
  .left {
    display: flex;
    margin-left: 0.6em;
    align-items: center;
    img {
      width: 40px;
      opacity: 0.5;
    }
    .fa-check-circle {
      font-size: ${(props) => props.theme.ms(2)};
      color: ${(props) => props.theme.middleGray};
    }
    p {
      margin-left: 1em;
      font-style: italic;
      color: ${(props) => props.theme.middleGray};
    }
  }
  .right {
    margin-left: auto;
  }
  svg {
    .plus-person {
      fill: gray;
    }
  }
`

interface StoreProps {
  offering: Offering;
  enrollments: Enrollments;
  rooms: RoomsState;
  createRoom: (offeringId?: string) => Promise<string>;
  setModal: typeof setModal;
}

const OfferingDefault = ({
  offering,
  enrollments,
  rooms,
  createRoom,
  setModal,
  match,
  history,
}: StoreProps & RouteComponentProps<{ offeringId: string }>) => {
  const room = (offering.room_id && rooms[offering.room_id]) || null
  const allSeated = useMemo(() => Object.values(enrollments)
    .every((enrollment) => enrollment.seat !== null), [enrollments])

  async function handleEditTables() {
    if (room && room.type === 'custom') {
      history.push(`/rooms/${offering.room_id}/${match.params.offeringId}`)
    } else {
      // We need to create a new custom room before directing to it.
      const newRoomId = await createRoom(offering.id)
      history.push(`/rooms/${newRoomId}/${match.params.offeringId}`)
    }
  }

  async function handleAddStudent() {
    setModal<AddStudentModalData>(ModalTypes.addStudent, {
      offeringId: offering.id,
    })
  }

  async function handlePrint() {
    setModal<PrintOfferingModalData>(ModalTypes.printOffering, {
      offeringId: offering.id,
    })
  }

  function handleChangeRoom() {
    setModal<ChangeRoomModalData>(ModalTypes.changeRoom, {
      offeringId: offering.id,
    })
  }

  return (
    <Container>
      <div className="left">
        {!allSeated && (
          <>
            <img src={PersonAdd} alt="" />
            <p>Click an empty seat below to place a student</p>
          </>
        )}
        {allSeated && Object.keys(enrollments).length > 0 && (
          <>
            <FontAwesomeIcon icon={['far', 'check-circle']} />
            <p>All students seated!</p>
          </>
        )}
      </div>
      <div className="right">
        {offering.room_id !== null
          ? (
            <ActionBarButton
              icon={['far', 'wrench']}
              text="Edit Tables and Seats"
              handler={handleEditTables}
            />
          ) : (
            <ActionBarButton
              icon={['far', 'map-marker-alt']}
              text="Assign Room"
              handler={handleChangeRoom}
            />
          )}
        <ActionBarButton
          icon={['far', 'user-plus']}
          text="Add Student"
          handler={handleAddStudent}
        />
        <ActionBarButton
          icon={['far', 'print']}
          text="Create Prints"
          handler={handlePrint}
        />
      </div>
    </Container>
  )
}

const mapState = ({
  offerings,
  enrollments,
  rooms,
}: AppState, {
  match,
}: RouteComponentProps<{ offeringId: string }>) => {
  const { offeringId } = match.params
  return {
    offering: offerings[offeringId],
    enrollments: enrollments[offeringId],
    rooms,
  }
}

export default connect(mapState, {
  createRoom,
  setModal,
})(OfferingDefault)
