import React, { useState, useRef } from 'react'
import { connect, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CSSTransition } from 'react-transition-group'
import api, { DataCats } from '../../utils/api'
import styled from '../../utils/styledComponents'
import TextButton from '../TextButton'
import { reportAxiosError } from '../../store/errors/actions'
import { receiveStudents } from '../../store/students/actions'
import { receiveOfferings } from '../../store/offerings/actions'

const Container = styled('div')`
  margin: 2em 0;
  input {
    margin-left: 1em;
  }
  .success {
    color: green;
  }
`

interface OwnProps {
  type: DataCats;
}

const UploadForm = ({ type }: OwnProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [results, setResults] = useState<{
    created: number | null;
    updated: number | null;
  }>({
    created: null,
    updated: null,
  })
  const dispatch = useDispatch()

  function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const { files } = e.target
    setResults({
      created: null,
      updated: null,
    })
    if (files) {
      setFile(files[0])
    }
  }

  function fileImportHandler() {
    if (file) {
      const fd = new FormData()
      fd.append('namespotData', file)

      setIsFetching(true)

      // Post the file and then process the results
      api.importFile(type, fd)
        .then(({ data }) => {
          if (inputRef.current) inputRef.current.value = ''
          setFile(null)
          setIsFetching(false)
          setResults({
            created: data.created,
            updated: data.updated,
          })
          if (Object.keys(data.students).length) dispatch(receiveStudents(data.students))
          if (Object.keys(data.offerings).length) dispatch(receiveOfferings(data.offerings))
        })
        .catch((e) => {
          dispatch(reportAxiosError(e))
          setFile(null)
          setIsFetching(false)
        })
    }
  }

  function handleUpload() {
    if (file) fileImportHandler()
  }

  return (
    <Container>
      <TextButton
        text={`Import ${type}`}
        variant="red"
        clickHandler={handleUpload}
        disabled={!file || isFetching}
        loading={isFetching}
      />
      <input
        ref={inputRef}
        type="file"
        id="csv-file"
        name="csv-file"
        accept=".csv"
        onChange={(e) => onFileSelect(e)}
      />
      <CSSTransition
        mountOnEnter
        in={results.created !== null || results.updated !== null}
        timeout={300}
        classNames="fade-enter"
        unmountOnExit
      >
        <div>
          <p className="success">
            <FontAwesomeIcon icon={['far', 'check-circle']} />&nbsp;
            Success! {results.created} record{results.created === 1 ? '' : 's'} created, {results.updated} record{results.updated === 1 ? '' : 's'} updated.
          </p>
        </div>
      </CSSTransition>
    </Container>
  )
}

export default connect()(UploadForm)
