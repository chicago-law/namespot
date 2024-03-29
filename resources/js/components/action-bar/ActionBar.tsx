import React, { useRef } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import styled from '../../utils/styledComponents'
import OfferingDefault from './OfferingDefault'
import { AppState } from '../../store'
import { SessionState } from '../../store/session/types'
import SeatStudent from './SeatStudent'
import StudentDetails from './StudentDetails'
import RoomDefault from './RoomDefault'
import EditTable from './EditTable'
import animateEntrance from '../../utils/animateEntrance'

const Container = styled('div')`
  position: sticky;
  height: 7em; /* must be same as .inner-container */
  top: 0;
  z-index: 1;
  ${animateEntrance('slideDown')};
  .inner-container {
    padding: 0 1em;
    background: white;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
    height: inherit; /* must be same as parent */
    >div {
      height: inherit;
    }
  }
`

interface StoreProps {
  session: SessionState;
}

const ActionBar = ({ session }: StoreProps) => {
  const actionBarRef = useRef<HTMLDivElement>(null)

  return (
    <Container ref={actionBarRef}>
      <div className="inner-container">
        <Route
          path="/rooms/:roomId/:offeringId?"
          render={props => (
            <>
              {session.task === null && (
                <RoomDefault {...props} />
              )}
              {session.task && (session.task === 'edit-table' || session.task === 'choose-point') && (
                <EditTable {...props} actionBarRef={actionBarRef.current} />
              )}
            </>
          )}
        />
        <Route
          path="/offerings/:offeringId"
          render={props => (
            <>
              {session.task === null && (
                <OfferingDefault {...props} />
              )}
              {session.task && session.task === 'seat-student' && (
                <SeatStudent {...props} actionBarRef={actionBarRef.current} />
              )}
              {session.task && session.task === 'student-details' && (
                <StudentDetails {...props} actionBarRef={actionBarRef.current} />
              )}
            </>
          )}
        />
      </div>
    </Container>
  )
}

const mapState = ({ session }: AppState) => ({
  session,
})

export default connect(mapState)(ActionBar)
