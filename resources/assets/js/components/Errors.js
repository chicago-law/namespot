import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { removeError } from '../actions'

class Errors extends Component {
  handleCloseClick = (e) => {
    const { dispatch } = this.props
    const name = e.target.closest('.error').getAttribute('data-errorname')
    dispatch(removeError(name))
  }

  render() {
    const { errors } = this.props

    return (
      <CSSTransition
        in={errors.length > 0}
        timeout={200}
        classNames="errors-container"
      >
        <ul className="errors-container">
          {errors.map(error => (
            <li key={error.name} className="error" data-errorname={error.name}>
              <div className="left">
                <FontAwesomeIcon icon={['far', 'exclamation-triangle']} />
              </div>
              <div className="center">
                <p>{error.message}</p>
              </div>
              <div className="right">
                <FontAwesomeIcon icon={['far', 'times']} onClick={e => this.handleCloseClick(e)} />
              </div>
            </li>
          ))}
        </ul>
      </CSSTransition>
    )
  }
}

const mapStateToProps = ({ app }) => ({
  errors: app.errors,
})

export default connect(mapStateToProps)(Errors)
