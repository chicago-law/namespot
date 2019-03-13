import React from 'react'
import classNames from 'classnames/bind'
import { CSSTransition } from 'react-transition-group'
import Loading from './Loading'

const SaveChangesButton = ({
 isDisabled, thinking, showSuccess, onSaveChanges,
}) => {
  const buttonClasses = classNames({
    'save-changes-button': true,
    'is-thinking': thinking,
    'show-success': showSuccess,
  })

  return (
    <div className={buttonClasses}>

      <CSSTransition
        in={showSuccess}
        timeout={300}
        classNames="saved"
        unmountOnExit
      >
        <span className="saved-message">Saved</span>
      </CSSTransition>

      <button
        className="btn-accent"
        onClick={onSaveChanges}
        disabled={isDisabled}
        type="button"
      >

        {thinking && (
          <Loading />
        )}

        {!thinking && (
          'Save Changes'
        )}

      </button>
    </div>
  )
}

export default SaveChangesButton
