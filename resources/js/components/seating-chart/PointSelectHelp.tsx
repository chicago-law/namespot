import React from 'react'
import styled from '../../utils/styledComponents'
import { SessionState } from '../../store/session/types'
import animateEntrance from '../../utils/animateEntrance'

const Container = styled('div')`
  position: relative;
  .message {
    background: ${(props) => props.theme.lightGray};
    border-radius: 15px;
    padding: 1em;
    ${animateEntrance('fadeSlideUp', 200, 0)};
    header {
      text-align: center;
      h4 {
        margin: 0.5em 0 1em 0;
        color: ${(props) => props.theme.darkBlue};
      }
    }
    p {
      font-size: ${(props) => props.theme.ms(-1)};
      font-style: italic;
    }
  }
`

interface OwnProps {
  session: SessionState;
}

const PointSelectHelp = ({ session }: OwnProps) => (
  <Container>
    {session.choosingPoint === 'start' && (
      <div className="message">
        <header>
          <svg width="25" height="31" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <circle fill="#AAA" fillRule="nonzero" cx="11" cy="11" r="11" />
              <path d="M24.32 23.337h-3.973l2.1 5.098a.64.64 0 0 1 0 .525.69.69 0 0 1-.375.375l-1.837.825a.555.555 0 0 1-.488 0 .69.69 0 0 1-.374-.375l-1.987-4.836-3.261 3.337c-.2.224-.438.274-.713.15a.65.65 0 0 1-.412-.638V11.68c0-.3.137-.506.412-.618.275-.113.513-.069.713.13l10.683 10.984c.2.2.244.444.131.731-.112.288-.318.431-.618.431z" fill="#444" />
            </g>
          </svg>
          <h4>Start Point</h4>
        </header>
        <p>Click the point where this section of seats should start. Both a <strong>start point</strong> and an <strong>end point</strong> are required.</p>
        <p>Use the controls above to change which point you're currently choosing.</p>
      </div>
    )}
    {session.choosingPoint === 'end' && (
      <div className="message">
        <header>
          <svg width="25" height="31" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <circle fill="#AAA" fillRule="nonzero" cx="11" cy="11" r="11" />
              <path d="M24.32 23.337h-3.973l2.1 5.098a.64.64 0 0 1 0 .525.69.69 0 0 1-.375.375l-1.837.825a.555.555 0 0 1-.488 0 .69.69 0 0 1-.374-.375l-1.987-4.836-3.261 3.337c-.2.224-.438.274-.713.15a.65.65 0 0 1-.412-.638V11.68c0-.3.137-.506.412-.618.275-.113.513-.069.713.13l10.683 10.984c.2.2.244.444.131.731-.112.288-.318.431-.618.431z" fill="#444" />
            </g>
          </svg>
          <h4>End Point</h4>
        </header>
        <p>Click the point where this section of seats should end. Both a <strong>start point</strong> and an <strong>end point</strong> are required.</p>
        <p>Use the controls above to change which point you're currently choosing.</p>
      </div>
    )}
    {session.choosingPoint === 'curve' && (
      <div className="message">
        <header>
          <svg width="25" height="31" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <circle fill="#AAA" fillRule="nonzero" cx="11" cy="11" r="11" />
              <path d="M24.32 23.337h-3.973l2.1 5.098a.64.64 0 0 1 0 .525.69.69 0 0 1-.375.375l-1.837.825a.555.555 0 0 1-.488 0 .69.69 0 0 1-.374-.375l-1.987-4.836-3.261 3.337c-.2.224-.438.274-.713.15a.65.65 0 0 1-.412-.638V11.68c0-.3.137-.506.412-.618.275-.113.513-.069.713.13l10.683 10.984c.2.2.244.444.131.731-.112.288-.318.431-.618.431z" fill="#444" />
            </g>
          </svg>
          <h4>Curve Point</h4>
        </header>
        <p>Click the grid where this section of seats should bend towards. This point is optional.</p>
        <p>Use the controls above to change which point you're currently choosing.</p>
      </div>
    )}
  </Container>
)

export default PointSelectHelp
