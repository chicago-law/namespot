import React from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { AppState } from '../../store'
import { SessionState } from '../../store/session/types'
import PointSelectHelp from './PointSelectHelp'

interface StoreProps {
  session: SessionState;
}

const RoomSidebarLeft = ({ session }: StoreProps) => (
  <div style={{ paddingRight: '1.5em' }}>
    <CSSTransition
      mountOnEnter
      in={session.task === 'choose-point'}
      timeout={300}
      classNames="slide-up-fade"
      unmountOnExit
    >
      <PointSelectHelp session={session} />
    </CSSTransition>
  </div>
)

const mapState = ({ session }: AppState) => ({
  session,
})

export default connect(mapState)(RoomSidebarLeft)
