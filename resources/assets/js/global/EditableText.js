import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { rootUrl } from '../actions';

export default class EditableText extends Component {
  constructor(props) {
    super(props)
    this.textRef = React.createRef();
    this.state = {
      isEditing: false,
      text: '',
      showingSaved:false
    }
  }

  handleEditClick() {
    this.setState({
      isEditing: true,
      text: this.textRef.current.textContent
    });
    this.textRef.current.setAttribute('contentEditable', true);
    this.textRef.current.focus();
    window.getSelection().selectAllChildren(this.textRef.current);
  }

  handleSaveClick() {
    const text = this.textRef.current.textContent;
    if (this.props.validator) {
      switch (this.props.validator) {
        case 'unique-room-name':
          this.validateUniqueRoomName(text);
          break;
        case 'unique-room-db-name':
          this.validateUniqueRoomDbName(text);
          break;
        default:
          this.props.requestError('validation-error','There was an error validating the text');
      }
    } else {
      saveValidText(text);
    }
  }

  // Validators for specific situations. Doing it this way because IE doesn't
  // support async await... it's a long story.
  validateUniqueRoomName(text) {
    axios.post(`${rootUrl}api/rooms/checkname`, {
      'name':text,
      'type':'name'
    })
    .then(response => {
      if (response.data === false) {
        this.props.requestError('name-taken','That name is already in use', true);
        this.textNotValid();
      } else if (response.data === true) {
        this.saveValidText(text);
      }
    })
    .catch(response => {
      this.props.requestError('cant-validate', `Unable to validate room name: ${response.message}`);
      this.textNotValid();
    });
  }
  validateUniqueRoomDbName(text) {
    axios.post(`${rootUrl}api/rooms/checkname`, {
      'name':text,
      'type':'db_match_name'
    })
    .then(response => {
      if (response.data === false) {
        this.props.requestError('name-taken','That name is already in use', true);
        this.textNotValid();
      } else if (response.data === true) {
        this.saveValidText(text);
      }
    })
    .catch(response => {
      this.props.requestError('cant-validate', `Unable to validate room name: ${response.message}`);
      this.textNotValid();
    });
  }

  saveValidText(text) {
    // make the save. validation, if it's happening, has already approved it
    this.props.save(text);
    this.setState({
      isEditing: false,
      showingSaved: true
    });

    // switch back to the default, ready state
    this.savedTimer = setTimeout(function () {
      this.setState({ showingSaved: false })
    }.bind(this), 2000);
    this.textRef.current.setAttribute('contentEditable', false);
    window.getSelection().removeAllRanges();
  }

  textNotValid() {
    // fire this if the validator has decided that we cannot save
    this.textRef.current.focus();
    window.getSelection().selectAllChildren(this.textRef.current);
  }

  handleCancelClick() {
    window.getSelection().removeAllRanges();
    this.setState({ isEditing: false })
    this.textRef.current.textContent = this.state.text;
    this.textRef.current.setAttribute('contentEditable', false);
  }

  handleKey(e) {
    if (e.which === 13) { // enter
      if (this.state.isEditing) {
        this.handleSaveClick();
        e.preventDefault();
      }
    }
    if (e.which === 27) { // esc
      if (this.state.isEditing) {
        this.handleCancelClick();
        e.preventDefault();
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.savedTimer);
  }

  render() {

    const saveOrCancel = (
      <div className='save-or-cancel'>
        <button className='btn-accent' onClick={() => this.handleSaveClick()}>Save</button>
        <button onClick={() => this.handleCancelClick()}>Cancel</button>
      </div>
    );
    const startEditing = (
      <i className="far fa-pencil" onClick={() => this.handleEditClick()} title="Click to edit"></i>
    );

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
    );
  }
}

EditableText.propTypes = {
  save: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  validator: PropTypes.string
}