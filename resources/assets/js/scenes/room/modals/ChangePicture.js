import React, { Component } from 'react'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import helpers from '../../../bootstrap'

export default class ChangePicture extends Component {
  state = {
    newPicture: ''
  }

  onFileSelect = (e) => {
    const file = e.target.files[0]
    this.newImageHandler(file)
  }

  newImageHandler(file) {
    const fd = new FormData()
    fd.append('newPicture', file, file.name)

    axios.post(`${helpers.rootUrl}api/student/upload-picture`, fd)
      .then(response => {
        if (response.data.result) {
          this.setState({ newPicture: response.data.name })
        }
      })
      .catch(response => this.props.requestError('new-picture', response.message))
  }

  onPictureChangeSave() {
    this.props.updateAndSaveStudent(this.props.student.id, 'picture', this.state.newPicture)
    this.props.setModal('change-picture', false)
  }

  render() {
    const { newPicture } = this.state
    const { student } = this.props

    const modalClasses = classNames({
      'change-picture': true,
    })

    return (
      <div className={modalClasses}>
        <header>
          <h2>Change Picture</h2>
        </header>

        <main>
          <p>Upload a new picture for {student.short_first_name}. Images must be PNG or JPG filetypes and under 500KB.</p>
          {newPicture && (
            <div className='picture' style={{ 'backgroundImage': `url('${helpers.rootUrl}images/students/${newPicture}')` }}></div>
          )}
          <input type='file' id='picture-file' name='picture-fire' accept='image/png, image/jpeg' onChange={this.onFileSelect} />
        </main>

        <footer className="controls">
          <button className='btn-clear' onClick={() => this.props.close()}><small>Cancel</small></button>
          <button className="btn-accent" onClick={() => this.onPictureChangeSave()}>Use This Picture</button>
        </footer>

      </div>
    )
  }
}

ChangePicture.propTypes = {
  close: PropTypes.func.isRequired,
  requestError: PropTypes.func.isRequired,
  setModal: PropTypes.func.isRequired,
  student: PropTypes.object.isRequired
}