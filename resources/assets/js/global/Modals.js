import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import { CSSTransition } from 'react-transition-group'
import ChangeRoom from '../scenes/room/modals/containers/ChangeRoom'
import AssignRoom from '../scenes/room/modals/containers/AssignRoom'
import EditEnrollment from '../scenes/room/modals/containers/EditEnrollment'
import PrintOffering from '../scenes/room/modals/containers/PrintOffering'
import LabelPosition from '../scenes/room/modals/containers/LabelPosition'
import ChangePicture from '../scenes/room/modals/containers/ChangePicture'
import ConfirmRoomDelete from '../scenes/select/modals/ConfirmRoomDelete'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Modals extends Component {
  state = {
    modalActive: Object.keys(this.props.modals).some(name => this.props.modals[name] === true )
  }

  handleCloseClick = () => {
    // Do a switch on them and we can write what to do for each here.
    // Most will just be to clear the modal out, but this allows customized behavior too.
    Object.keys(this.props.modals).forEach(type => {
      if (this.props.modals[type]) {
        switch (type) {
          case 'change-room':
            this.props.setModal(type, false)
            break
          case 'assign-room':
            this.props.setModal(type, false)
            // this.props.history.push('/select/offerings')
            break
          case 'edit-enrollment':
            this.props.setModal(type, false)
            break
          case 'print-room':
            this.props.setModal(type, false)
            break
          case 'label-position':
            this.props.setModal(type, false)
            break
          case 'change-picture':
            this.props.setModal(type, false)
            break
          case 'confirm-room-delete':
            this.props.setModal(type, false)
            this.props.resetCurrentRoom()
            break
          default:
            this.props.setModal(type, false)
        }
      }
    })
  }

  onKeyDown = (e) => {
    if (e.which === 27) {
      this.handleCloseClick()
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.modals != this.props.modals) {
      this.setState({
        modalActive: Object.keys(this.props.modals).some(name => this.props.modals[name] === true )
      })
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
  }

  render() {
    const { modalActive } = this.state
    const { modals } = this.props

    const modalWindowClasses = classNames({
      'modal-container__window':true,
      'change-room': modals['change-room'],
      'assign-room': modals['assign-room'],
      'edit-enrollment': modals['edit-enrollment'],
      'print-room': modals['print-room'],
      'label-position': modals['label-position'],
      'change-picture': modals['change-picture'],
      'confirm-room-delete': modals['confirm-room-delete'],
    })

    return (
      <CSSTransition
        in={modalActive}
        mountOnEnter
        timeout={300}
        classNames='modal-container'
        unmountOnExit
      >
        <div className='modal-container'>

          <div className={modalWindowClasses}>
          <p>{modalActive}</p>
            <FontAwesomeIcon icon={['far', 'times']} onClick={this.handleCloseClick} />
            <div className="content">

              {/* Print Offering */}
              <CSSTransition
                in={modals['print-room']}
                mountOnEnter
                timeout={300}
                classNames='content'
                unmountOnExit
              >
                <PrintOffering close={this.handleCloseClick} />
              </CSSTransition>

              {/* Change Room */}
              <CSSTransition
                in={modals['change-room']}
                mountOnEnter
                timeout={300}
                classNames='content'
                unmountOnExit
              >
                <ChangeRoom close={this.handleCloseClick} />
              </CSSTransition>

              {/* Assign Room */}
              <CSSTransition
                in={modals['assign-room']}
                mountOnEnter
                timeout={300}
                classNames='content'
                unmountOnExit
              >
                <AssignRoom close={this.handleCloseClick} />
              </CSSTransition>

              {/* Edit Enrollment */}
              <CSSTransition
                in={modals['edit-enrollment']}
                mountOnEnter
                timeout={300}
                classNames='content'
                unmountOnExit
              >
                <EditEnrollment close={this.handleCloseClick} />
              </CSSTransition>

              {/* Label Position */}
              <CSSTransition
                in={modals['label-position']}
                mountOnEnter
                timeout={300}
                classNames='content'
                unmountOnExit
              >
                <LabelPosition close={this.handleCloseClick} />
              </CSSTransition>

              {/* Change Picture */}
              <CSSTransition
                in={modals['change-picture']}
                mountOnEnter
                timeout={300}
                classNames='content'
                unmountOnExit
              >
                <ChangePicture close={this.handleCloseClick} />
              </CSSTransition>

              {/* Confirm Room Delete */}
              <CSSTransition
                in={modals['confirm-room-delete']}
                mountOnEnter
                timeout={300}
                classNames='content'
                unmountOnExit
              >
                <ConfirmRoomDelete close={this.handleCloseClick} />
              </CSSTransition>

            </div>
          </div>

          <div className="modal-container__shader" onClick={() => this.handleCloseClick()}></div>

        </div>
      </CSSTransition>
    )
  }
}

Modals.propTypes = {
  history: PropTypes.object.isRequired,
  modals: PropTypes.object.isRequired,
  setModal: PropTypes.func.isRequired

}