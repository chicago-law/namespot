import React, { Component } from 'react';
import PropTypes from 'prop-types';
import helpers from '../../bootstrap';

export default class RosterGallery extends Component {
  constructor(props) {
    super(props)
  }

  handleStudentClick(e) {
    this.props.setCurrentStudentId(parseInt(e.target.getAttribute('studentid')));
    this.props.setTask('student-details');
    e.stopPropagation();
  }

  render() {

    const currentStudents = this.props.currentStudents.map(student =>
      <li key={student.id}>
        <div
          studentid={student.id}
          className='picture'
          style={{ 'backgroundImage': `url('${helpers.rootUrl}images/faces/${student.picture}.jpg')` }}
          title={student.first_name + ' ' + student.last_name}
          seated={student.seats['offering_' + this.props.currentOffering.id] != null ? "true" : "false"}
          onClick={(e) => this.handleStudentClick(e)}
        />
      </li>
    )

    return (
      <div className="roster-gallery">

        <div className="seated">
          <p>Seated</p>
          <ul>
            {currentStudents.filter(student => student.props.children.props.seated === 'true' ? true : false)}
          </ul>
        </div>

        <div className="unseated">
          <p>Not Seated</p>
          <ul>
            {currentStudents.filter(student => student.props.children.props.seated === 'false' ? true : false)}
          </ul>
        </div>

      </div>
    );
  }
}

RosterGallery.propTypes = {
  assignSeat: PropTypes.func.isRequired,
  currentOffering: PropTypes.object.isRequired,
  currentStudents: PropTypes.array.isRequired,
  id: PropTypes.string
}