import React, { Component } from 'react'
import helpers from '../../bootstrap'

class Import extends Component {
  onFileSelect = (e) => {
    console.log('yeah')
    this.fileUploadHandler(e.target.files[0])
  }

  fileUploadHandler(file) {
    const fd = new FormData()
    fd.append('namespotData', file, file.name)

    axios.post(`${helpers.rootUrl}api/import/students`, fd)
      .then(response => {
        console.log(response)
      })
      .catch(response => this.props.requestError('file-upload', response.message))
  }

  render() {
    return (
      <div>
        <p>Import yo data here.</p>
        <input type='file' id='csv-file' name='csv-file' accept='csv' onChange={this.onFileSelect} />
      </div>
    )
  }
}

export default Import
