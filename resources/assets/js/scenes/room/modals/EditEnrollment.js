import React, { Component } from 'react'
import classNames from 'classnames/bind'
import Loading from '../../../global/Loading'
import helpers from '../../../bootstrap'

export default class EditEnrollment extends Component {
  constructor(props) {
    super(props)
    this.searchRef = React.createRef()
    this.state = {
      query: '',
      studentResults: [],
      resultCount: 0,
      showingAllResults: false
    }
  }

  handleSearchInput(e) {
    this.setState({
      query: e.target.value,
      showingAllResults:false
    })
    this.searchStudents(e.target.value)
  }

  handleShowAllResults() {
    this.searchStudents(this.state.query, false)
    this.setState({ showingAllResults: true })
  }

  searchStudents(query, limited = true) {
    this.props.setLoadingStatus('student-search', true)
    const params = limited ? { 'limit': 10 } : {}
    axios.get(`${helpers.rootUrl}api/students/search`, {
      params: {
        ...params,
        's': query,
      }
    })
    .then(response => {
      this.setState({
        studentResults: response.data.students,
        resultCount: response.data.count
      })
      this.props.setLoadingStatus('student-search', false)
    })
    .catch(response => {
      this.props.setLoadingStatus('student-search', false)
      this.props.requestError('student-search', response.message, true)
    })
  }

  addStudent(e) {
    const id = e.target.closest('.student').getAttribute('data-studentid')
    const student = this.state.studentResults.filter(student => String(student.id) === String(id))[0]
    // close the modal
    this.props.setModal('edit-enrollment',false)
    // is the student already in the class?
    if (!this.props.currentOffering.students.includes(parseInt(id))) {

      // add the student to the store
      const formattedStudent = {
        [id]: {
          ...student,
        }
      }
      this.props.receiveStudents(formattedStudent)

      // update student with seat slot for this offering
      const seats = {
        ...student['seats'],
        [`offering_${this.props.currentOffering.id}`]: null
      }
      this.props.updateAndSaveStudent(id, 'seats', seats)

      // update student with flag saying it was manually attached
      this.props.updateAndSaveStudent(id, 'manually_attached', 1)

      // update the offering
      const students = [...this.props.currentOffering.students, parseInt(id)]
      this.props.requestUpdateOffering(this.props.currentOffering.id, 'students', students)
    }
  }

  componentDidMount() {
    this.searchRef.current.focus()
  }

  render() {

    const modalClasses = classNames({
      'is-loading': this.props.loading['student-search']
    })

    let resultsList = ''
    if (this.state.studentResults.length > 0) {
      resultsList = this.state.studentResults.map(student => {
        return (
          <li
            key={student.id}
            className='student'
            data-studentid={student.id}
            onClick={(e) => this.addStudent(e)}
          >
            {student.first_name} {student.nickname} {student.last_name} <i className="far fa-user-plus"></i>
          </li>
       )})
    }

    return (
      <div className={modalClasses}>
        <Loading />
        <header>
          <h2><i className="far fa-user-plus"></i>Add Student To Class</h2>
        </header>

        <main>
          <p>If for some reason a student is not enrolled in a class through Canvas, then they will not show up automatically here in the class's seating chart roster.</p>
          <p>You can manually add a student to this class when necessary by searching all Law students below.</p>
          <div className="input-container">
            <i className="far fa-search"></i>
            <input type='text' ref={this.searchRef} placeholder="Search all Law students..." onChange={(e) => this.handleSearchInput(e)} value={this.state.query} />
          </div>
          <div className="results-status">
            {this.state.query.length ?
              this.state.showingAllResults ?
                <p>Found {this.state.resultCount} results.</p>
              : this.props.loading['student-search'] ?
                <p>Searching...</p>
              : this.state.resultCount > 10 ?
                <p>Showing first 10 of {this.state.resultCount} results. <span onClick={() => this.handleShowAllResults()}>Show all</span></p>
              : this.state.resultCount === 0 ?
                <p>No results with "{this.state.query}"</p>
              : this.state.resultCount === 1 ?
                <p>Found {this.state.resultCount} result</p>
              : <p>Found {this.state.resultCount} results</p>
              : <p>&nbsp;</p>
            }
          </div>
          <div className="results-list-container">
            {this.state.query.length ?
              <ul className='results-list'>
                {resultsList}
              </ul>
              : ''
            }
          </div>
        </main>

        <footer className="controls">
          <button className='btn-clear' onClick={() => this.props.close()}><small>Cancel</small></button>
        </footer>

      </div>
    )
  }
}