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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Modals extends Component {
  state = {
    modalActive: Object.keys(this.props.modals).some(name => this.props.modals[name] === true )
  }

  handleCloseClick = () => {
    // loop through all modals, do a switch on them and we can write what to do for each here
    // most will just be to clear the modal out, but this allows customized behavior too
    Object.keys(this.props.modals).forEach(type => {
      if (this.props.modals[type]) {
        switch (type) {
          case 'change-room':
            this.props.setModal(type, false)
            break
          case 'assign-room':
            this.props.setModal(type, false)
            this.props.history.push('/select/offerings')
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
          default:
            return false
        }
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.modals != this.props.modals) {
      this.setState({
        modalActive: Object.keys(this.props.modals).some(name => this.props.modals[name] === true )
      })
    }
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
      'change-picture': modals['change-picture']
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
              {modals['change-room'] ? <ChangeRoom close={() => this.handleCloseClick()}/> : false}
              {modals['assign-room'] ? <AssignRoom close={() => this.handleCloseClick()} /> : false}
              {modals['edit-enrollment'] ? <EditEnrollment close={() => this.handleCloseClick()} /> : false}
              {modals['print-room'] ? <PrintOffering close={() => this.handleCloseClick()} /> : false}
              {modals['label-position'] ? <LabelPosition close={() => this.handleCloseClick()} /> : false}
              {modals['change-picture'] ? <ChangePicture close={() => this.handleCloseClick()} /> : false}
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