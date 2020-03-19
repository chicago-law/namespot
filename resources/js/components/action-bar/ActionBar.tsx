import React, { useRef, useState } from 'react'
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

const Container = styled('div')<{ hasEntered: boolean }>`
  position: sticky;
  height: 7em; /* must be same as .inner-container */
  top: 0;
  z-index: 1;
  ${(props) => (!props.hasEntered ? animateEntrance('slideDown') : '')};
  .inner-container {
    padding: 0 1em;
    background: white;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
    height: inherit; /* must be same as parent */
    transition: box-shadow 200ms ease-out;
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
  const [isFloating, setFloating] = useState(false)

  // Kinda hacky, but we're using hasEntered to track whether or not the
  // action bar container should have the CSS animation on it or not.
  // Otherwise, it interferes with making the bar floating. So this way
  // we remove the animation when we go to make the bar floating.
  const [hasEntered, setHasEntered] = useState(false)

  function positionActionBar() {
    const { siteHeader } = session.measuredElements
    const { scrolledFromTop } = session

    if (siteHeader && siteHeader.height) {
      if (scrolledFromTop > siteHeader.height) {
        setFloating(true)
        if (!hasEntered) setHasEntered(true)
      } else {
        setFloating(false)
      }
    }
  }

  return (
    <Container ref={actionBarRef} className={isFloating ? 'is-floating' : ''} hasEntered={hasEntered}>
      <div className="inner-container">
        <Route
          path="/rooms/:roomId/:offeringId?"
          render={(props) => (
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
          render={(props) => (
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
