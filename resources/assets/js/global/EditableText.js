import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import helpers from '../bootstrap'
import { requestError } from '../actions'

class EditableText extends Component {
  state = {
    isEditing: false,
    text: '',
    showingSaved:false
  }

  textRef = React.createRef()

  handleEditClick = () => {
    this.setState({
      isEditing: true,
      text: this.textRef.current.textContent
    })
    this.textRef.current.setAttribute('contentEditable', true)
    this.textRef.current.focus()
    window.getSelection().selectAllChildren(this.textRef.current)
  }

  handleSaveClick = () => {
    const { dispatch } = this.props
    const text = this.textRef.current.textContent.trim()
    if (this.props.validator) {
      switch (this.props.validator) {
        case 'unique-room-name':
          this.validateUniqueRoomName(text)
          break
        case 'unique-room-db-name':
          this.validateUniqueRoomDbName(text)
          break
        case 'student-nickname':
          this.validateStudentNickname(text)
          break
        default:
          dispatch(requestError('validation-error','There was an error validating the text'))
      }
    } else {
      this.saveValidText(text)
    }
  }

  /**
   * Custom validation functions for specific situations. Sigh, it's a long story.
   *
   * Stay a while, and listen...
   * Ideally, both the Validate and the Save functions should live on the parent
   * of EditableText, in the interest of keeping it completely reusable. These
   * would get passed in as props, and then from within EditableText you'd call
   * the validator, and depending on what it says you'd call the save.
   *
   * However, if you want the validating function to make an API call and base
   * its decision on whether it passed or not from results of the call, you must
   * use async/await. Make the call, and tell the Save function to await the
   * API response. Unfortunately, IE doesn't support this at all, and so this
   * component itself must be the one making that validation API call. So we
   * store all the validating functions here, and the parent gives a string
   * to tell us which built-in validation function to use.
   *
   * Update: There is a better way to do this, and it doesn't require async/await.
   */

  validateUniqueRoomName(text) {
    axios.post(`${helpers.rootUrl}api/rooms/checkname`, {
      'name':text,
      'type':'name'
    })
    .then(response => {
      if (response.data === false) {
        this.props.requestError('name-taken','That name is already in use', true)
        this.textNotValid()
      } else if (response.data === true) {
        this.saveValidText(text)
      }
    })
    .catch(response => {
      this.props.requestError('cant-validate', `Unable to validate room name: ${response.message}`)
      this.textNotValid()
    })
  }

  validateUniqueRoomDbName(text) {
    axios.post(`${helpers.rootUrl}api/rooms/checkname`, {
      'name':text,
      'type':'db_match_name'
    })
    .then(response => {
      if (response.data === false) {
        this.props.requestError('name-taken','That name is already in use', true)
        this.textNotValid()
      } else if (response.data === true) {
        this.saveValidText(text)
      }
    })
    .catch(response => {
      this.props.requestError('cant-validate', `Unable to validate room name: ${response.message}`)
      this.textNotValid()
    })
  }

  saveValidText(text) {
    // Validation, if it's happening, has already approved it at this point,
    // so go ahead and call whatever Save function was passed in from parent.
    this.props.save(text)
    this.setState({
      isEditing: false,
      showingSaved: true
    })

    // switch back to the default, ready state
    this.savedTimer = setTimeout(function () {
      this.setState({ showingSaved: false })
    }.bind(this), 2000)
    this.textRef.current.setAttribute('contentEditable', false)
    window.getSelection().removeAllRanges()
  }

  textNotValid() {
    // fire this if the validator has decided that we cannot save
    this.textRef.current.focus()
    window.getSelection().selectAllChildren(this.textRef.current)
  }

  handleCancelClick() {
    window.getSelection().removeAllRanges()
    this.setState({ isEditing: false })
    this.textRef.current.textContent = this.state.text
    this.textRef.current.setAttribute('contentEditable', false)
  }

  handleKey(e) {
    if (e.which === 13) { // enter
      if (this.state.isEditing) {
        this.handleSaveClick()
        e.preventDefault()
      }
    }
    if (e.which === 27) { // esc
      if (this.state.isEditing) {
        this.handleCancelClick()
        e.preventDefault()
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.savedTimer)
  }

  render() {

    const saveOrCancel = (
      <div className='save-or-cancel'>
        <button className='btn-accent' onClick={() => this.handleSaveClick()}>Save</button>
        <button onClick={() => this.handleCancelClick()}>Cancel</button>
      </div>
    )
    const startEditing = (
      <FontAwesomeIcon icon={['far', 'pencil']} onClick={this.handleEditClick} title="Click to edit" />
    )

    return (
      <div className='editable-text-container' onKeyDown={e => this.handleKey(e)}>
        <p ref={this.textRef}>
          {this.props.text}
        </p>
        <div className='controls'>
          {this.state.isEditing ? saveOrCancel : startEditing}
          <CSSTransition
            in={this.state.showingSaved}
            timeout={500}
            classNames="saved"
            unmountOnExit
          >
            <span className='saved'>Saved</span>
          </CSSTransition>
        </div>
      </div>
    )
  }
}

export default connect()(EditableText)