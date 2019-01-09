import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import helpers from '../../bootstrap'
import { assignSeat, setTask, setCurrentSeatId } from '../../actions'

class AbFindStudent extends Component {
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
    const { dispatch, currentOffering, currentSeatId, task } = this.props
    if (task === 'find-student') {
      dispatch(assignSeat(currentOffering.id, e.target.closest('[data-studentid]').dataset.studentid, currentSeatId))
      dispatch(setTask('offering-overview'))
    }
  }

  handleCancelSearch = () => {
    const { dispatch } = this.props
    dispatch(setTask('offering-overview'))
  }

  handleKeyDown(e) {
    if (e.which === 27) {
      this.handleCancelSearch()
    }
  }

  clearQuery = () => {
    this.setState({ query: '' })
  }

  checkForMatch(student) {
    const { query } = this.state
    const regex = new RegExp(query, 'gi')
    // concat together everything should be searchable
    if ((`${student.nickname} ${student.first_name} ${student.last_name} ${student.short_full_name} ${student.nickname} ${student.canvas_id}`).match(regex)) {
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
    const { dispatch } = this.props
    dispatch(setCurrentSeatId(null))
  }

  render() {
    const { showSearchInput, query } = this.state
    const { currentOffering, currentStudents } = this.props

    // Students without seats
    const unseatedStudents = currentStudents.filter(student => student.enrollment['offering_' + currentOffering.id].seat === null)
    // Students that match the query
    const filteredStudents = unseatedStudents.filter(student => this.checkForMatch(student))

    return (
      <div className='action-bar action-bar-find-student' onKeyDown={e => this.handleKeyDown(e)}>
        <FontAwesomeIcon icon={['far', 'arrow-left']} onClick={this.handleCancelSearch} />
        <CSSTransition
          in={showSearchInput}
          timeout={300}
          classNames='input-container'
        >
          <div className="input-container">
            {query.length
              ? <FontAwesomeIcon icon={['fas','times-circle']} onClick={this.clearQuery} />
              : <FontAwesomeIcon icon={['far','search']} />
            }
            <input type='text' ref={this.filterRef} placeholder="Type to find student..." onChange={(e) => this.handleSearchInput(e)} value={query}/>
          </div>
        </CSSTransition>
        <div className="roster-container">
          <ul>{filteredStudents.map(student =>
              <li key={student.id} data-studentid={student.id} onClick={(e) => this.handleStudentClick(e)}>
                <div className="picture" style={{ 'backgroundImage': `url('${helpers.rootUrl}storage/student_pictures/${student.picture}')` }}></div>
                <p data-email={student.email}>
                  {student.short_first_name ? student.short_first_name : student.first_name} {student.last_name}</p>
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

const mapStateToProps = (state) => {
  // Students enrolled in this class
  const currentStudents = Object.keys(state.entities.students)
    .filter(id => state.app.currentOffering.students.includes(parseInt(id)))
    .map(id => state.entities.students[id])
    .sort((a, b) => b.last_name.toUpperCase() < a.last_name.toUpperCase() ? 1 : -1)

  return {
    currentStudents,
    currentOffering:state.app.currentOffering,
    currentSeatId:state.app.currentSeatId,
    task:state.app.task
  }
}

export default connect(mapStateToProps)(AbFindStudent)
