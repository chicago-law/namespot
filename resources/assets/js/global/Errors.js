import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'

export default class Errors extends Component {
  handleCloseClick(e) {
    const name = e.target.closest('.error').getAttribute('data-errorname')
    this.props.removeError(name)
  }

  render() {

    const errorList = this.props.errors.map(error => {
      return (
        <li key={error.name} className='error' data-errorname={error.name}>
          <div className="left">
            <i className="far fa-exclamation-triangle"></i>
          </div>
          <div className='center'>
            <p>{error.message}</p>
          </div>
          <div className="right">
            <i className="far fa-times" onClick={(e) => this.handleCloseClick(e)}></i>
          </div>
        </li>
      )
    })

    return (
      <CSSTransition
        in={this.props.errors.length > 0 ? true : false}
        timeout={200}
        classNames='errors-container'
      >
        <ul className='errors-container'>
          {errorList}
        </ul>
      </CSSTransition>
    )
  }
}

Errors.propTypes = {
  errors:PropTypes.array,
  removeError: PropTypes.func.isRequired
}