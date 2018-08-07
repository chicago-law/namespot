import React, { Component } from 'react'
import classNames from 'classnames/bind'
import { CSSTransition } from 'react-transition-group'
import ChangeRoom from '../scenes/room/modals/containers/ChangeRoom'
import AssignRoom from '../scenes/room/modals/containers/AssignRoom'
import EditEnrollment from '../scenes/room/modals/containers/EditEnrollment'
import PrintOffering from '../scenes/room/modals/containers/PrintOffering'
import LabelPosition from '../scenes/room/modals/containers/LabelPosition'

export default class Modals extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalActive: Object.keys(this.props.modals).some(name => this.props.modals[name] === true )
    }
  }

  handleCloseClick() {
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

    const modalWindowClasses = classNames({
      'modal-container__window':true,
      'change-room': this.props.modals['change-room'],
      'assign-room': this.props.modals['assign-room'],
      'edit-enrollment': this.props.modals['edit-enrollment'],
      'print-room': this.props.modals['print-room'],
      'label-position': this.props.modals['label-position']
    })

    return (
      <CSSTransition
        in={this.state.modalActive}
        mountOnEnter
        timeout={300}
        classNames='modal-container'
        unmountOnExit
      >
        <div className='modal-container'>

          <div className={modalWindowClasses}>
          <p>{this.state.modalActive}</p>
            <i className="far fa-times" onClick={() => this.handleCloseClick()}></i>
            <div className="content">
              {this.props.modals['change-room'] ? <ChangeRoom close={() => this.handleCloseClick()}/> : false}
              {this.props.modals['assign-room'] ? <AssignRoom close={() => this.handleCloseClick()} /> : false}
              {this.props.modals['edit-enrollment'] ? <EditEnrollment close={() => this.handleCloseClick()} /> : false}
              {this.props.modals['print-room'] ? <PrintOffering close={() => this.handleCloseClick()} /> : false}
              {this.props.modals['label-position'] ? <LabelPosition close={() => this.handleCloseClick()} /> : false}
            </div>
          </div>

          <div className="modal-container__shader" onClick={() => this.handleCloseClick()}></div>

        </div>
      </CSSTransition>
    )
  }
}