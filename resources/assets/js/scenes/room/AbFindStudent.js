import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import helpers from '../../bootstrap'

export default class AbFindStudent extends Component {
  state = {
    query: '',
    showSearchInput: false
  }

  filterRef = React.createRef()

  handleSearchInput(e) {
    this.setState({
      query:e.target.value
    })
  }

  handleStudentClick(e) {
    if (this.props.task === 'find-student') {
      this.props.assignSeat(this.props.currentOffering.id, e.target.closest('[data-studentid]').dataset.studentid, this.props.currentSeatId)
      this.props.setTask('offering-overview')
    }
  }

  handleCancelSearch() {
    this.props.setTask('offering-overview')
  }

  handleKeyDown(e) {
    if (e.which === 27) {
      this.handleCancelSearch()
    }
  }

  checkForMatch(student) {
    const regex = new RegExp(this.state.query, 'gi')
    // concat together everything should be searchable
    if ((`${student.nickname} ${student.first_name} ${student.last_name} ${student.short_full_name} ${student.nickname} ${student.cnet_id}`).match(regex)) {
      return true
    }
  }

  componentDidMount() {
    // slide the input into place
    this.setState({ showSearchInput: true})
    // focus in the search box
    this.filterRef.current.focus()
  }

  componentWillUnmount() {
    this.props.setCurrentSeatId(null)
  }

  render() {
    const { showSearchInput, query } = this.state
    const { currentOffering, currentStudents } = this.props

    // Only show students without seats
    const unseatedStudents = currentStudents.filter(student => student.seats['offering_' + currentOffering.id] == null)
    // Only show students that match the query
    const filteredStudents = unseatedStudents.filter(student => this.checkForMatch(student))

    return (
      <div className='action-bar action-bar-find-student' onKeyDown={e => this.handleKeyDown(e)}>
        <i className="far fa-arrow-left" onClick={() => this.handleCancelSearch()}></i>
        <CSSTransition
          in={showSearchInput}
          timeout={300}
          classNames='input-container'
        >
          <div className="input-container">
            <i className="far fa-search"></i>
            <input type='text' ref={this.filterRef} placeholder="Type to find student..." onChange={(e) => this.handleSearchInput(e)} value={query}/>
          </div>
        </CSSTransition>
        <div className="roster-container">
          <ul>{ filteredStudents.map(student =>
              <li key={student.id} data-studentid={student.id} onClick={(e) => this.handleStudentClick(e)}>
                <div className="picture" style={{'backgroundImage':`url('${helpers.rootUrl}images/students/${student.picture}')`}}></div>
                <p data-email={student.email}>
                  {/* {student.first_name} {student.first_name !== student.short_first_name && student.short_first_name} {student.last_name}</p> */}
                  {student.short_first_name} {student.last_name}</p>
              </li>
            )}
            { filteredStudents.length == 0
              ? unseatedStudents.length == 0
                ? <li className='no-results'>No unseated students.</li>
                : <li className='no-results'>No unseated students found with "{query}"</li>
              : false
            }
          </ul>
        </div>
      </div>
    )
  }
}

AbFindStudent.propTypes = {
  assignSeat: PropTypes.func.isRequired,
  currentOffering: PropTypes.object.isRequired,
  currentSeatId: PropTypes.string.isRequired,
  currentStudents: PropTypes.array.isRequired,
  setCurrentSeatId: PropTypes.func.isRequired,
  setTask: PropTypes.func.isRequired,
  task: PropTypes.string.isRequired,
}