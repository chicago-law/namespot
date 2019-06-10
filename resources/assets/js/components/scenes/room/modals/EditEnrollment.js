import React, { Component } from 'react'
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Loading from '../../../Loading'
import helpers from '../../../../bootstrap'

export default class EditEnrollment extends Component {
  state = {
    query: '',
    studentResults: [],
    resultCount: 0,
    showingAllResults: false,
  }

  searchRef = React.createRef()

  componentDidMount() {
    this.searchRef.current.focus()
  }

  handleSearchInput = (e) => {
    this.setState({
      query: e.target.value,
      showingAllResults: false,
    })
    this.searchStudents(e.target.value)
  }

  handleShowAllResults = () => {
    const { query } = this.state

    this.searchStudents(query, false)
    this.setState({ showingAllResults: true })
  }

  searchStudents = (query, limited = true) => {
    const { setLoadingStatus, requestError } = this.props

    setLoadingStatus('student-search', true)
    const params = limited ? { limit: 10 } : {}
    axios.get(`${helpers.rootUrl}api/students/search`, {
      params: {
        ...params,
        s: query,
      },
    })
    .then((response) => {
      this.setState({
        studentResults: response.data.students,
        resultCount: response.data.count,
      })
      setLoadingStatus('student-search', false)
    })
    .catch((response) => {
      setLoadingStatus('student-search', false)
      requestError('student-search', response.message, true)
    })
  }

  clearQuery = () => {
    this.setState({ query: '' })
  }

  onStudentClick = (studentId) => {
    const { currentOffering } = this.props

    // Proceed only if the student is not already in the class roster
    if (!currentOffering.students.includes(parseInt(studentId))) {
      this.addStudent(studentId)
    }
  }

  addStudent(studentId) {
    const {
      currentOffering,
      setModal,
      receiveStudents,
      updateAndSaveStudent,
      updateOffering,
    } = this.props
    const { studentResults } = this.state

    const student = studentResults.find(result => String(result.id) === String(studentId))
    setModal('edit-enrollment', false)

    // add the student to the store
    const formattedStudent = {
      [studentId]: {
        ...student,
      },
    }
    receiveStudents(formattedStudent)

    // update student with seat slot for this offering
    const enrollment = {
      ...student.enrollment,
      [`offering_${currentOffering.id}`]: {
        seat: null,
        is_namespot_addition: 1,
      },
    }

    // The way things are now, we do need to do two separate calls for this,
    // because just the first will not actually save is_namespot_addition in the DB.
    // Soo that's why we're also doing the second.
    updateAndSaveStudent(studentId, 'enrollment', enrollment, currentOffering.id)
    updateAndSaveStudent(studentId, 'is_namespot_addition', 1, currentOffering.id)

    // update the offering's enrollment list in the store.
    const students = [...currentOffering.students, parseInt(studentId)]
    updateOffering(currentOffering.id, 'students', students)
  }

  render() {
    const { loading, close, currentOffering } = this.props
    const {
      studentResults,
      query,
      resultCount,
      showingAllResults,
    } = this.state

    const modalClasses = classNames({
      'is-loading': loading['student-search'],
    })

    const resultsList = studentResults.map((student) => {
      const alreadyEnrolled = currentOffering.students.includes(parseInt(student.id))
      return (
        <li key={student.id} className="student">
          <button
            type="button"
            onClick={() => this.onStudentClick(student.id)}
          >
            {student.first_name} {student.nickname} {student.last_name}
            <span>
              { alreadyEnrolled
                ? 'Already enrolled'
                : <FontAwesomeIcon icon={['far', 'user-plus']} />
              }
            </span>
          </button>
        </li>
      )
    })


    return (
      <div className={modalClasses}>
        <Loading />
        <header>
          <h2><FontAwesomeIcon icon={['far', 'user-plus']} /> Add Student To Class</h2>
        </header>

        <main>
          <p>If for some reason a student is not enrolled in a class through Canvas, then they will not show up automatically here in the class's seating chart roster.</p>
          <p>You can manually add a student to this class when necessary by searching all Law students below.</p>
          <div className="input-container">
            {query.length
              ? <FontAwesomeIcon icon={['fas', 'times-circle']} onClick={this.clearQuery} />
              : <FontAwesomeIcon icon={['far', 'search']} />
            }
            <input type="text" ref={this.searchRef} placeholder="Search all Law students..." onChange={e => this.handleSearchInput(e)} value={query} />
          </div>
          <div className="results-status">
            {(query.length > 0 && showingAllResults) && (
              <p>Found {resultCount} results.</p>
            )}
            {(query.length > 0 && !loading['student-search'] && !showingAllResults) && (
              <p>
                {resultCount > 10 && (
                  <>
                    Showing first 10 of {resultCount} results.
                    <button type="button" onClick={() => this.handleShowAllResults()}>Show all</button>
                  </>
                )}
                {(resultCount <= 10 && resultCount > 0) && (
                  `Found ${resultCount} result${resultCount === 1 ? '' : 's'}`
                )}
                {resultCount === 0 && `No results with ${query}`}
              </p>
            )}
            {!query.length === 0 && <p>&nbsp;</p>}
          </div>
          <div className="results-list-container">
            {query.length > 0 && (
              <ul className="results-list">
                {resultsList}
              </ul>
            )}
          </div>
        </main>

        <footer className="controls">
          <button type="button" className="btn-clear" onClick={() => close()}>Cancel</button>
        </footer>

      </div>
    )
  }
}
