import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class AbFindStudent extends Component {
  constructor(props) {
    super(props)
    this.filterRef = React.createRef();
    this.state = {
      search:''
    }
  }

  handleSearchInput(e) {
    this.setState({
      search:e.target.value
    });
  }

  handleStudentClick(e) {
    if (this.props.task === 'find-student') {
      this.props.assignSeat(this.props.currentOffering.id, e.target.closest('[data-studentid]').dataset.studentid, this.props.currentSeatId)
      this.props.setTask('offering-overview');
    }
  }

  checkForMatch(student) {
    const regex = new RegExp(this.state.search, 'gi');
    if (student.first_name.match(regex)) { // check the first name
      return true;
    }
    if (student.last_name.match(regex)) { // check the last name
      return true;
    }
    if ((student.first_name + ' ' + student.last_name).match(regex)) { // check concat of first and last name
      return true;
    }
    if (student.email.match(regex)) { // check student's email
      return true;
    }
  }

  componentDidMount() {
    // focus in the search box when component mounts
    this.filterRef.current.focus();
  }

  render() {
    const rootUrl = document.querySelector('body').dataset.root;
    const unseatedStudents = this.props.currentStudents.filter(student => student.seats['offering_' + this.props.currentOffering.id] == null).filter(student => this.checkForMatch(student));

    return (
      <div className='action-bar action-bar-find-student'>
        <i className="far fa-arrow-left" onClick={() => this.props.setTask('offering-overview')}></i>
        <div className="filter-container">
          <i className="far fa-search"></i>
          <input type='text' ref={this.filterRef} placeholder="Type to find student..." onChange={(e) => this.handleSearchInput(e)} value={this.state.search}/>
        </div>
        <div className="roster-container">
          <ul>
            { unseatedStudents.map(student =>
              <li key={student.id} data-studentid={student.id} onClick={(e) => this.handleStudentClick(e)}>
                <div className="picture" style={{'backgroundImage':`url('${rootUrl}images/faces/${student.picture}.jpg')`}}></div>
                <p data-email={student.email}>{student.first_name}<br/>{student.last_name}</p>
              </li>
            )}
            { unseatedStudents.length == 0 ? <li className='no-results'>No unseated students found with "{this.state.search}"</li> : false }
          </ul>
        </div>
      </div>
    );
  }
}

AbFindStudent.propTypes = {
  assignSeat: PropTypes.func.isRequired,
  currentOffering: PropTypes.object.isRequired,
  currentSeatId: PropTypes.string.isRequired,
  currentStudents: PropTypes.array.isRequired,
  setCurrentStudentId: PropTypes.func.isRequired,
  setTask: PropTypes.func.isRequired,
  task: PropTypes.string.isRequired,
}