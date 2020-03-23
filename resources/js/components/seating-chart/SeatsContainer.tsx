import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import styled from '../../utils/styledComponents'
import { AppState } from '../../store'
import { Seat } from '../../store/seats/types'
import SingleSeat from './SingleSeat'
import { Room } from '../../store/rooms/types'
import { OfferingsState, Offering } from '../../store/offerings/types'
import { StudentsState } from '../../store/students/types'
import { setTask, selectSeat, selectStudent } from '../../store/session/actions'
import { SessionState, Tasks } from '../../store/session/types'
import { EnrollmentsState } from '../../store/enrollments/types'
import { PrintingState } from '../../store/printing/types'
import calcSeatFontSize from '../../utils/calcSeatFontSize'

const seatScale = 4

interface ContainerProps {
  seatSize: number;
  editingRoom: boolean;
  paperSize: 'letter' | 'tabloid';
  offering: Offering | null;
}
const Container = styled('div')<ContainerProps>`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  ${(props) => props.editingRoom && `
    pointer-events: none;
    z-index: -1;
  `};
  /* We'll do all the styling for single seats here so that we don't have
  Styled Components creating extra components for every single seat. */
  .seat {
    position: absolute;
    height: ${(props) => (props.paperSize === 'letter' ? props.seatSize * 0.65 : props.seatSize) * seatScale}px;
    width: ${(props) => (props.paperSize === 'letter' ? props.seatSize * 0.65 : props.seatSize) * seatScale}px;
    transform-origin: top left;
    transform: scale(${(props) => 1 / seatScale}) translate(-50%, -50%) ${(props) => props.offering && !!props.offering.flipped && ' rotate(180deg)'};
    ${(props) => props.offering && !!props.offering.flipped && `
      transform-origin: 20% 20%;
    `}
    .pic-container {
      position: relative;
      height: 100%;
      width: 100%;
      border-radius: ${(props) => seatScale * 7}px;
      background: #fff;
      overflow: hidden;
      text-align: center;
      cursor: pointer;
      transition: transform 250ms cubic-bezier(.18,.89,.32,1.28);
      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
        object-position: center;
      }
    }
    &.background .pic-container {
      background: ${(props) => props.theme.lightGray};
    }
    &.border-only .pic-container {
      background: white;
      border-style: solid;
      border-color: ${(props) => props.theme.middleGray};
      border-width: ${(props) => (props.paperSize === 'letter' ? `${seatScale * 3}px` : `${seatScale * 4}px`)};
    }
    svg {
      border-radius: 5px;
      rect {
        fill: #CCCCCC;
        width: 40px;
        height: 40px;
      }
      .plus-person {
        transform: translate(9px, 9px);
        fill: ${(props) => props.theme.black};
        transition: fill 100ms ease-out;
      }
    }
    .name-label {
      position: absolute;
      margin: 0;
      line-height: 1em;
      font-size: ${(props) => calcSeatFontSize(props.offering)};
      span {
        display: block;
      }
      &.below {
        top: 100%;
        left: -30%;
        right: -30%;
        text-align: center;
        transform-origin: top;
        transform: scale(${(props) => seatScale}) translateY(0.25em);
        ${(props) => props.offering && !!props.offering.flipped && `
          top: auto;
          bottom: 100%;
          transform-origin: bottom;
          transform: scale(${seatScale}) translateY(-0.25em);
        `}
      }
      &.above {
        bottom: 100%;
        left: -30%;
        right: -30%;
        text-align: center;
        transform-origin: below;
        transform: scale(${(props) => seatScale}) translateY(-0.25em);
        ${(props) => props.offering && !!props.offering.flipped && `
          bottom: auto;
          top: 100%;
          transform-origin: top;
          transform: scale(${seatScale}) translateY(0.25em);
        `}
      }
      &.right {
        top: 50%;
        left: 100%;
        transform-origin: top left;
        transform: scale(${(props) => seatScale}) translate(0.5em, -50%);
        ${(props) => props.offering && !!props.offering.flipped && `
          left: auto;
          right: 100%;
          text-align: right;
          transform-origin: top right;
          transform: scale(${seatScale}) translate(-0.5em, -50%);
        `}
      }
      &.left {
        top: 50%;
        right: 100%;
        text-align: right;
        transform-origin: top right;
        transform: scale(${(props) => seatScale}) translate(-0.5em, -50%);
        ${(props) => props.offering && !!props.offering.flipped && `
          left: 100%;
          right: auto;
          text-align: left;
          transform-origin: top left;
          transform: scale(${seatScale}) translate(0.5em, -50%);
        `}
      }
    }
    &.focused {
      z-index: 999;
      svg {
        rect {
          fill: ${(props) => props.theme.red};
        }
        .plus-person {
          fill: white !important;
        }
      }
      .pic-container {
        z-index: 999;
        transform: scale(1.5);
        box-shadow: 0 3px 10px rgba(0,0,0, .25);
      }
    }
    &:hover {
      svg {
        .plus-person {
          fill: ${(props) => props.theme.red};
        }
      }
    }
  }
`

interface StoreProps {
  seats: { [seatId: string]: Seat };
  room: Room;
  offerings: OfferingsState;
  students: StudentsState;
  enrollments: EnrollmentsState;
  session: SessionState;
  printing: PrintingState;
  setTask: typeof setTask;
  selectSeat: typeof selectSeat;
  selectStudent: typeof selectStudent;
}
interface OwnProps {
  roomId: string;
}
type RouteProps = RouteComponentProps<{ offeringId?: string; roomId?: string }>

const SeatsContainer = ({
  seats,
  room,
  offerings,
  students,
  enrollments,
  session,
  printing,
  setTask,
  selectSeat,
  selectStudent,
  match,
}: StoreProps & OwnProps & RouteProps) => {
  const { offeringId } = match.params
  const offering = offeringId ? offerings[offeringId] : null
  const isOffering = !!match.params.offeringId && !match.params.roomId
  const isRoom = !!match.params.roomId

  function findOccupant(seatId: string) {
    if (offering && enrollments[offering.id]) {
      const matchedStudentId = Object.keys(enrollments[offering.id])
        .find((studentId) => offering
          && enrollments[offering.id][studentId]
          && enrollments[offering.id][studentId].seat === seatId)
      if (matchedStudentId && students[matchedStudentId]) {
        return students[matchedStudentId]
      }
    }
    return null
  }

  function seatClickTaskRouter(taskType: Tasks, seatId: string, studentId: string | null) {
    switch (taskType) {
      case 'seat-student':
        setTask('seat-student')
        selectSeat(seatId)
        break
      case 'student-details':
        setTask('student-details')
        selectSeat(seatId)
        selectStudent(studentId)
        break
      default:
    }
  }

  return (
    <Container
      id="seats-container"
      className="seats-container"
      seatSize={room.seat_size}
      paperSize={(offering && offering.paper_size) || 'tabloid'}
      editingRoom={!!match.params.roomId}
      offering={offering}
    >
      {/*
        Only show if it's an offering and we're either not printing, or we are
        printing but all seats blank is off.
      */}
      {(isOffering && (!printing.isPrinting || (printing.isPrinting && !printing.options.allSeatsBlank))) && (
        Object.keys(seats).map((seatId) => (
          <SingleSeat
            key={seatId}
            seat={seats[seatId]}
            occupant={offering ? findOccupant(seatId) : null}
            isOffering={isOffering}
            namesToShow={(offering && offering.names_to_show) || 'first_and_last'}
            useNicknames={offering && offering.use_nicknames !== null ? !!offering.use_nicknames : true}
            usePrefixes={offering && offering.use_prefixes !== null ? !!offering.use_prefixes : false}
            isFocused={session.selectedSeat === seatId}
            seatClickTaskRouter={seatClickTaskRouter}
            printing={printing}
          />
        ))
      )}
      {(isRoom || (printing.isPrinting && printing.options.allSeatsBlank)) && (
        Object.keys(seats).map((seatId) => (
          <SingleSeat
            key={seatId}
            seat={seats[seatId]}
            occupant={null}
            isOffering={isOffering}
            namesToShow={(offering && offering.names_to_show) || 'first_and_last'}
            useNicknames={offering && offering.use_nicknames !== null ? !!offering.use_nicknames : true}
            usePrefixes={offering && offering.use_prefixes !== null ? !!offering.use_prefixes : false}
            isFocused={false}
            printing={printing}
          />
        ))
      )}
    </Container>
  )
}

const mapState = ({
  seats,
  rooms,
  offerings,
  students,
  enrollments,
  session,
  printing,
}: AppState, { roomId }: OwnProps) => ({
  seats: seats[roomId] || {},
  room: rooms[roomId],
  offerings,
  students,
  enrollments,
  session,
  printing,
})

export default withRouter(connect(mapState, {
  setTask,
  selectSeat,
  selectStudent,
})(SeatsContainer))
