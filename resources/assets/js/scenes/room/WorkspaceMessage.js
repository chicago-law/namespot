import React, { Component } from 'react'
import { CSSTransition } from 'react-transition-group'

export default class WorkspaceMessage extends Component {
  render() {
    const { pointSelection } = this.props

    return (
      <div className='workspace-message-container'>

        <CSSTransition
          mountOnEnter
          in={pointSelection === 'start'}
          timeout={300}
          classNames={'message'}
          unmountOnExit
        >
          <div className='message-content'>
            <div className='message-icon'>
              <p>
                <svg width="25" height="31" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><circle fill="#AAA" fillRule="nonzero" cx="11" cy="11" r="11"/><path d="M24.32 23.337h-3.973l2.1 5.098a.64.64 0 0 1 0 .525.69.69 0 0 1-.375.375l-1.837.825a.555.555 0 0 1-.488 0 .69.69 0 0 1-.374-.375l-1.987-4.836-3.261 3.337c-.2.224-.438.274-.713.15a.65.65 0 0 1-.412-.638V11.68c0-.3.137-.506.412-.618.275-.113.513-.069.713.13l10.683 10.984c.2.2.244.444.131.731-.112.288-.318.431-.618.431z" fill="#444"/></g></svg>
              </p>
            </div>
            <h6>Start Point</h6>
            <p>Click the grid where this section of seats should start. Both a start point and an end point are required.</p>
            <p>Use the controls above to change which point you're currently choosing.</p>
          </div>
        </CSSTransition>

        <CSSTransition
          mountOnEnter
          in={pointSelection === 'curve'}
          timeout={300}
          classNames={'message'}
          unmountOnExit
        >
          <div className='message-content'>
            <div className='message-icon'>
              <p>
                <svg width="25" height="31" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><circle fill="#AAA" fillRule="nonzero" cx="11" cy="11" r="11"/><path d="M24.32 23.337h-3.973l2.1 5.098a.64.64 0 0 1 0 .525.69.69 0 0 1-.375.375l-1.837.825a.555.555 0 0 1-.488 0 .69.69 0 0 1-.374-.375l-1.987-4.836-3.261 3.337c-.2.224-.438.274-.713.15a.65.65 0 0 1-.412-.638V11.68c0-.3.137-.506.412-.618.275-.113.513-.069.713.13l10.683 10.984c.2.2.244.444.131.731-.112.288-.318.431-.618.431z" fill="#444"/></g></svg>
              </p>
            </div>
            <h6>Curve Point</h6>
            <p>Click the grid where this section of seats should bend towards. This point is optional.</p>
            <p>Use the controls above to change which point you're currently choosing.</p>
          </div>
        </CSSTransition>

        <CSSTransition
          mountOnEnter
          in={pointSelection === 'end'}
          timeout={300}
          classNames={'message'}
          unmountOnExit
        >
          <div className='message-content'>
            <div className='message-icon'>
              <p>
                <svg width="25" height="31" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><circle fill="#AAA" fillRule="nonzero" cx="11" cy="11" r="11"/><path d="M24.32 23.337h-3.973l2.1 5.098a.64.64 0 0 1 0 .525.69.69 0 0 1-.375.375l-1.837.825a.555.555 0 0 1-.488 0 .69.69 0 0 1-.374-.375l-1.987-4.836-3.261 3.337c-.2.224-.438.274-.713.15a.65.65 0 0 1-.412-.638V11.68c0-.3.137-.506.412-.618.275-.113.513-.069.713.13l10.683 10.984c.2.2.244.444.131.731-.112.288-.318.431-.618.431z" fill="#444"/></g></svg>
              </p>
            </div>
            <h6>End Point</h6>
            <p>Click the grid where this section of seats should end. Both a start point and an end point are required.</p>
            <p>Use the controls above to change which point you're currently choosing.</p>
          </div>
        </CSSTransition>

      </div>
    )
  }
}