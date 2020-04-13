import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CSSTransition } from 'react-transition-group'
import styled from '../../utils/styledComponents'
import IconButton from '../IconButton'
import ucLogo from '../../../images/uchicago-logo.png'
import { theme } from '../../utils/theme'
import { AppState } from '../../store'
import { User } from '../../store/authedUser/types'

const Sidebar = styled('div')<{ isOpen: boolean }>`
  position: fixed;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  overflow-y: auto;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 0;
  padding: 1em;
  width: 16em;
  color: white;
  transform: translateX(${(props) => (props.isOpen ? '0' : '-20em')});
  background: ${(props) => props.theme.black};
  box-shadow: 0 0 15px rgba(0,0,0, 0.25);
  transition: transform 500ms ${(props) => props.theme.fastEaseOut};
  section {
    padding-bottom: 1em;
    margin-bottom: 1em;
    border-bottom: 1px solid rgba(255,255,255, 0.1);
    &.flex-row {
      display: flex;
      align-items: center;
    }
    &.logo-container {
      padding: 0 1em 0.25em 1em;
      border: 0;
    }
    img {
      margin: 1em 0;
    }
  }
  a {
    display: flex;
    align-items: center;
    color: white;
    text-decoration: none;
    svg {
      font-size: ${(props) => props.theme.ms(1)};
      padding: 1em;
      box-sizing: content-box; /* FontAwesome fixedWidth doesn't like border-box for some reason */
    }
    &:hover {
      color: ${(props) => props.theme.red};
    }
  }
`
const Shader = styled('div')`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0,0,0, 0.2);
`

interface StoreProps {
  authedUser: User;
}

const Menu = ({ authedUser }: StoreProps) => {
  const [isOpen, setOpen] = useState(false)

  return (
    <>
      <IconButton
        icon={['far', 'bars']}
        handler={() => setOpen(true)}
        iconColor={theme.red}
      />

      <Sidebar isOpen={isOpen}>
        <section className="flex-row">
          <IconButton
            icon={['far', 'arrow-left']}
            fixedWidth
            handler={() => setOpen(false)}
            iconColor="white"
            backgroundHoverColor="none"
            boxShadow={false}
          />
          <h3>{authedUser.first_name}<br />{authedUser.last_name}</h3>
        </section>
        <section>
          <Link to="/offerings" onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={['far', 'map']} fixedWidth />
            <p>Classes</p>
          </Link>
          {(authedUser.role === 'staff' || authedUser.role === 'dev') && (
            <>
              <Link to="/rooms" onClick={() => setOpen(false)}>
                <FontAwesomeIcon icon={['far', 'map-marker-alt']} fixedWidth />
                <p>Rooms</p>
              </Link>
              <Link to="/students" onClick={() => setOpen(false)}>
                <FontAwesomeIcon icon={['far', 'users']} fixedWidth />
                <p>Students</p>
              </Link>
            </>
          )}
        </section>
        <section>
          {(authedUser.role === 'staff' || authedUser.role === 'dev') && (
            <>
              {/* Removing the import/export functionality for now. */}
              {/* <Link to="/import-export" onClick={() => setOpen(false)}>
                <FontAwesomeIcon icon={['far', 'upload']} fixedWidth />
                <p>Import / Export Data</p>
              </Link> */}
              <Link to="/settings" onClick={() => setOpen(false)}>
                <FontAwesomeIcon icon={['far', 'cog']} fixedWidth />
                <p>Settings</p>
              </Link>
            </>
          )}
          <a href="/logout" onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={['far', 'sign-out-alt']} fixedWidth />
            <p>Log Out</p>
          </a>
        </section>
        <section className="logo-container">
          <img src={ucLogo} alt="" />
        </section>
      </Sidebar>

      <CSSTransition
        mountOnEnter
        in={isOpen}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <Shader className="shader" onClick={() => setOpen(false)} aria-hidden="true" />
      </CSSTransition>
    </>
  )
}

const mapState = ({ authedUser }: AppState) => ({
  authedUser,
})

export default connect(mapState)(Menu)
