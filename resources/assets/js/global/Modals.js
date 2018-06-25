import React, { Component } from 'react';
import classNames from 'classnames/bind';
import ChangeRoom from '../scenes/Room/modals/containers/ChangeRoom';

export default class Modals extends Component {
  constructor(props) {
    super(props)
  }

  handleCloseClick() {
    this.props.setModal('change-room',false);
  }

  render() {

    const modalContainerClasses = classNames({
      'modal-container':true,
      'is-active':this.props.modals['change-room']
    })

    return (
      <div className={modalContainerClasses}>
        <div className="modal-window">
          <i className="far fa-times" onClick={() => this.handleCloseClick()}></i>
          <div className="content">
            { this.props.modals['change-room'] ? <ChangeRoom /> : false }
          </div>
        </div>
        <div className="shader" onClick={() => this.handleCloseClick()}></div>
      </div>
    )
  }
}