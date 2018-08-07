import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import { CSSTransition } from 'react-transition-group'
import Loading from './Loading'

export default class SaveChangesButton extends Component {
  state = {
    thinking: false,
    showSuccess: false
  }


  onSaveClick = (e) => {
    e.preventDefault()
    this.setState({ thinking: true })
    new Promise((resolve, reject) => {
      this.props.onSaveChanges(resolve, reject)
    })
    .then(() => {
      this.setState({
        thinking: false,
        showSuccess: true
      })
      setTimeout(() => {
        this.setState({ showSuccess: false })
      }, 2000)
    })
    .catch(response => {
      this.setState({ thinking: false })
      console.log(response)
    })
  }

  render() {

    const buttonClasses = classNames({
      'save-changes-button': true,
      'is-thinking': this.state.thinking,
      'show-success': this.state.showSuccess
    })

    return (
      <div className={buttonClasses}>

        <CSSTransition
          in={this.state.showSuccess}
          timeout={300}
          classNames="saved"
          unmountOnExit
        >
          <span className='saved-message'>Saved</span>
        </CSSTransition>

        <button
          className='btn-accent'
          onClick={this.onSaveClick}
        >

          {this.state.thinking && (
            <Loading />
          )}

          {!this.state.thinking && (
            <span>Save Changes</span>
          )}

        </button>
      </div>
    )
  }
}

SaveChangesButton.propTypes = {
  onSaveChanges: PropTypes.func.isRequired
}