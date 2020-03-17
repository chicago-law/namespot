import React from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from '../../utils/styledComponents'
import { AppState } from '../../store'
import { ErrorsState } from '../../store/errors/types'
import IconButton from '../IconButton'
import { removeError } from '../../store/errors/actions'
import { theme } from '../../utils/theme'
import { SessionState } from '../../store/session/types'

const Container = styled('div')`
  border: 2px solid ${(props) => props.theme.darkBlue};
  background: ${(props) => props.theme.lightGray};
  >div {
    display: flex;
    align-items: center;
    padding: 0.5em 1em;
    p {
      margin: 0 auto 0 0;
    }
    .fa-robot {
      margin-right: 0.5em;
      font-size: ${(props) => props.theme.ms(2)};
      color: ${(props) => props.theme.darkGray};
    }
    .icon-button {
      flex: 0 0 auto;
    }
  }
`

interface StoreProps {
  session: SessionState;
  errors: ErrorsState;
  removeError: typeof removeError;
}


const Errors = ({ session, errors, removeError }: StoreProps) => {
  if (Object.keys(errors).length === 0) {
    return <></>
  }

  return (
    <Container style={{ transform: `translateY(${session.scrolledFromTop}px)` }}>
      {Object.keys(errors).map((id) => (
        <div key={id}>
          <FontAwesomeIcon icon={['far', 'robot']} />
          <p>Bzzzz! We ran into an error. It might help to refresh the page and try again. Here's what the server had to say for itself: <strong>{errors[id]}</strong></p>
          <IconButton
            icon={['far', 'times']}
            handler={() => removeError(parseInt(id))}
            iconColor={theme.red}
            backgroundHoverColor={theme.middleGray}
          />
        </div>
      ))}
    </Container>
  )
}

const mapState = ({
  session,
  errors,
}: AppState) => ({
  session,
  errors,
})

export default connect(mapState, {
  removeError,
})(Errors)
