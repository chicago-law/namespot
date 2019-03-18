import React, { Component } from 'react'
import PropTypes from 'prop-types'
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

  handleSearchInput(e) {
    this.setState({
      query: e.target.value,
      showingAllResults: false,
    })
    this.searchStudents(e.target.value)
  }

  handleShowAllResults() {
    this.searchStudents(this.state.query, false)
    this.setState({ showingAllResults: true })
  }

  searchStudents(query, limited = true) {
    this.props.setLoadingStatus('student-search', true)
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
      this.props.setLoadingStatus('student-search', false)
    })
    .catch((response) => {
      this.props.setLoadingStatus('student-search', false)
      this.props.requestError('student-search', response.message, true)
    })
  }

  clearQuery = () => {
    this.setState({ query: '' })
  }

  onStudentClick = (e) => {
    const studentId = e.target.closest('.student').getAttribute('data-studentid')
    // Proceed only if the student is not already in the class roster
    if (!this.props.currentOffering.students.includes(parseInt(studentId))) {
      this.addStudent(studentId)
    }
  }

  addStudent(studentId) {
    const student = this.state.studentResults.find(student => String(student.id) === String(studentId))
    this.props.setModal('edit-enrollment', false)

    // add the student to the store
    const formattedStudent = {
      [studentId]: {
        ...student,
      },
    }
    this.props.receiveStudents(formattedStudent)

    // update student with seat slot for this offering
    const enrollment = {
      ...student.enrollment,
      [`offering_${this.props.currentOffering.id}`]: {
        seat: null,
        is_namespot_addition: 1,
      },
    }

    // The way things are now, we do need to do two separate calls for this,
    // because just the first will not actually save is_namespot_addition in the DB.
    // Soo that's why we're also doing the second.
    this.props.updateAndSaveStudent(studentId, 'enrollment', enrollment)
    this.props.updateAndSaveStudent(studentId, 'is_namespot_addition', 1)

    // update the offering's enrollment list in the store.
    const students = [...this.props.currentOffering.students, parseInt(studentId)]
    this.props.updateOffering(this.props.currentOffering.id, 'students', students)

    // update the store's currentOffering
    this.props.findAndSetCurrentOffering(this.props.currentOffering.id)
  }

  componentDidMount() {
    this.searchRef.current.focus()
  }

  render() {
    const {
 studentResults, query, resultCount, showingAllResults,
} = this.state
    const { loading, close } = this.props

    const modalClasses = classNames({
      'is-loading': loading['student-search'],
    })


    const resultsList = studentResults.map((student) => {
      const alreadyEnrolled = this.props.currentOffering.students.includes(parseInt(student.id))
      return (
        <li
          key={student.id}
          className="student"
          data-studentid={student.id}
          onClick={this.onStudentClick}
        >
          {student.first_name} {student.nickname} {student.last_name}
          <span>
            { alreadyEnrolled
              ? 'Already enrolled'
              : <FontAwesomeIcon icon={['far', 'user-plus']} />
            }
          </span>
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
            {query.length
              ? showingAllResults
                ? <p>Found {resultCount} results.</p>
                : loading['student-search']
                  ? <p>Searching...</p>
                  : resultCount > 10
                    ? <p>Showing first 10 of {resultCount} results. <span onClick={() => this.handleShowAllResults()}>Show all</span></p>
                    : resultCount === 0
                      ? <p>No results with "{query}"</p>
                      : resultCount === 1
                        ? <p>Found {resultCount} result</p>
                        : <p>Found {resultCount} results</p>
              : <p>&nbsp;</p>
            }
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
          <button className="btn-clear" onClick={() => close()}>Cancel</button>
        </footer>

      </div>
    )
  }
}

EditEnrollment.propTypes = {
  close: PropTypes.func.isRequired,
  currentOffering: PropTypes.object.isRequired,
  findAndSetCurrentOffering: PropTypes.func.isRequired,
  loading: PropTypes.object.isRequired,
  receiveStudents: PropTypes.func.isRequired,
  requestError: PropTypes.func.isRequired,
  setLoadingStatus: PropTypes.func.isRequired,
  setModal: PropTypes.func.isRequired,
  updateAndSaveStudent: PropTypes.func.isRequired,
  updateOffering: PropTypes.func.isRequired,
}