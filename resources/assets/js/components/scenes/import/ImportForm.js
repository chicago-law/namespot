import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CSSTransition } from 'react-transition-group'
import { normalize } from 'normalizr'
import classNames from 'classnames/bind'
import * as schema from '../../../actions/schema'
import helpers from '../../../bootstrap'
import {
  requestError,
  receiveStudents,
  receiveOfferings,
} from '../../../actions'

class ImportForm extends Component {
  state = {
    file: null,
    fetching: false,
    results: {
      created: null,
      updated: null,
    },
  }

  inputRef = React.createRef()

  onFileSelect = (e) => {
    this.setState({
      file: e.target.files[0],
    })
  }

  onImport = () => {
    const { file } = this.state
    if (file) this.fileImportHandler()
  }

  fileImportHandler = () => {
    const { file } = this.state
    const { type, dispatch } = this.props
    const fd = new FormData()

    fd.append('namespotData', file, file.name)
    this.setState({ fetching: true })
    // Post the file and then process the results
    axios.post(`${helpers.rootUrl}api/import/${type}`, fd)
      .then(({ data }) => {
        this.inputRef.current.value = null
        this.receiveEntities(data)
        this.setState({
          file: null,
          fetching: false,
          results: {
            created: data.created,
            updated: data.updated,
          },
        })
      })
      .catch(({ response }) => {
        const { status, data } = response
        const { message } = data
        this.setState({ fetching: false })
        dispatch(requestError('file-upload', `${status} error: ${message}`))
      })
  }

  receiveEntities = (data) => {
    const { dispatch } = this.props
    if (data.students) {
      const normalizedData = normalize(data.students, schema.studentListSchema)
      dispatch(receiveStudents(normalizedData.entities.students))
    }
    if (data.offerings) {
      const normalizedData = normalize(data.offerings, schema.offeringListSchema)
      dispatch(receiveOfferings(normalizedData.entities.offerings))
    }
  }

  render() {
    const { file, fetching, results } = this.state
    const { type } = this.props
    const buttonClassNames = classNames({
      'btn-accent': true,
      fetching,
    })

    return (
      <div className="import-form">
        <button
          type="button"
          className={buttonClassNames}
          disabled={!file || fetching}
          onClick={this.onImport}
        >
          <FontAwesomeIcon icon={['fas', 'spinner-third']} spin />
          <span>Import {type}</span>
        </button>
        <input
          ref={this.inputRef}
          type="file"
          id="csv-file"
          name="csv-file"
          accept=".csv"
          onChange={e => this.onFileSelect(e)}
        />
        <CSSTransition
          mountOnEnter
          in={results.created !== null || results.updated !== null}
          timeout={300}
          classNames="results"
          unmountOnExit
        >
          <div className="results">
            <p>
              <FontAwesomeIcon icon={['far', 'check']} />&nbsp;
              Success! {results.created} record{results.created === 1 ? '' : 's'} created, {results.updated} record{results.updated === 1 ? '' : 's'} updated.
            </p>
          </div>
        </CSSTransition>
      </div>
    )
  }
}

export default connect()(ImportForm)
