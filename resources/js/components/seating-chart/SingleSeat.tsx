import React from 'react'
import { Seat } from '../../store/seats/types'
import { Student } from '../../store/students/types'
import { Tasks } from '../../store/session/types'
import { PrintingState } from '../../store/printing/types'
import StudentThumbnail from './StudentThumbnail'

interface OwnProps {
  seat: Seat;
  occupant: Student | null;
  isOffering: boolean;
  namesToShow: 'first_and_last' | 'first_and_last_initial' | 'first_only' | 'last_only';
  useNicknames: boolean;
  usePrefixes: boolean;
  isFocused: boolean;
  printing: PrintingState;
  seatClickTaskRouter?: (taskType: Tasks, seatId: string, studentId: string | null) => void;
}

const SingleSeat = ({
  seat,
  occupant,
  isOffering,
  namesToShow,
  useNicknames,
  usePrefixes,
  isFocused,
  printing,
  seatClickTaskRouter,
}: OwnProps) => {
  function handleClick(e: React.BaseSyntheticEvent) {
    e.stopPropagation()
    if (occupant) {
      if (seatClickTaskRouter) seatClickTaskRouter('student-details', seat.id, occupant.id)
    } else if (seatClickTaskRouter) seatClickTaskRouter('seat-student', seat.id, null)
  }

  function getSeatClasses() {
    let classes = 'seat'
    if (isFocused) classes += ' focused'
    if (!occupant && !isOffering) classes += ' background'
    if (!occupant && printing.isPrinting) classes += ' border-only'
    return classes
  }

  function getNames() {
    if (occupant) {
      switch (namesToShow) {
        case 'first_and_last':
          return [
            `${usePrefixes && occupant.prefix ? `${occupant.prefix} ` : ''}${useNicknames && occupant.nickname ? occupant.nickname : occupant.short_first_name}`,
            occupant.short_last_name,
          ]
        case 'first_only':
          return [
            `${usePrefixes && occupant.prefix && `${occupant.prefix} `}${useNicknames && occupant.nickname ? occupant.nickname : occupant.short_first_name}`,
            '',
          ]
        case 'last_only':
          return [
            '',
            `${usePrefixes && occupant.prefix && `${occupant.prefix} `}${occupant.short_last_name}`,
          ]
        case 'first_and_last_initial':
          return [
            `${usePrefixes && occupant.prefix ? `${occupant.prefix} ` : ''}${useNicknames && occupant.nickname ? occupant.nickname : occupant.short_first_name}`,
            occupant.short_last_name.substr(0, 1).toUpperCase(),
          ]
        default:
          return ['', '']
      }
    }
    return ['', '']
  }

  const [firstName, lastName] = getNames()

  return (
    <div
      className={getSeatClasses()}
      data-seat-id={seat.id}
      onClick={(e: React.BaseSyntheticEvent) => handleClick(e)}
      onKeyPress={(e: React.BaseSyntheticEvent) => handleClick(e)}
      role="button"
      tabIndex={0}
      style={{
        top: seat.y,
        left: seat.x,
      }}
    >
      <div className="pic-container">
        {/* If there's no occupant and we're not printing, show the Add User image */}
        {!occupant && !printing.isPrinting && isOffering && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 40 40"
            height="100%"
            width="100%"
          >
            <rect height="40" width="40" />
            <g className="plus-person">
              <path d="M15,12 C17.21,12 19,10.21 19,8 C19,5.79 17.21,4 15,4 C12.79,4 11,5.79 11,8 C11,10.21 12.79,12 15,12 Z M6,10 L6,7 L4,7 L4,10 L1,10 L1,12 L4,12 L4,15 L6,15 L6,12 L9,12 L9,10 L6,10 Z M15,14 C12.33,14 7,15.34 7,18 L7,20 L23,20 L23,18 C23,15.34 17.67,14 15,14 Z" />
            </g>
          </svg>
        )}
        {occupant && (
          <StudentThumbnail student={occupant} />
        )}
      </div>
      {occupant && (
        <p className={`name-label ${seat.labelPosition ? seat.labelPosition : 'below'}`}>
          <span>{firstName}</span>
          <span>{lastName}</span>
        </p>
      )}
    </div>
  )
}

export default React.memo(SingleSeat)
