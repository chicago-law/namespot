import React from 'react';
import PropTypes from 'prop-types';

const RosterGallery = ({ currentStudents, currentOffering, assignSeat }) => {
  const rootUrl = document.querySelector('body').dataset.root;

  return (
    <div className="roster-gallery">

      <div className="seated">
        <p className='enrollment'><i className="far fa-users fa-fw"></i> {currentOffering.students.length} Students Enrolled</p>
        <p>Seated</p>
        <ul>
          {
            currentStudents.filter(student => student.seats['offering_' + currentOffering.id] != null ? true : false).map(student =>
              <li key={student.id}>
                <div
                  id={'student_' + student.id}
                  className='picture'
                  style={{ 'backgroundImage': `url('${rootUrl}images/faces/${student.picture}.jpg')` }}
                  title={student.first_name + ' ' + student.last_name}
                />
              </li>
            )
          }
        </ul>
      </div>

      <div className="unseated">
        <p>Not Seated</p>
        <ul>
          {
            currentStudents.filter(student => student.seats['offering_' + currentOffering.id] === null ? true : false).map(student =>
              <li key={student.id}>
                <div
                  id={'student_' + student.id}
                  className='picture'
                  style={{ 'backgroundImage': `url('${rootUrl}images/faces/${student.picture}.jpg')` }}
                  title={student.first_name + ' ' + student.last_name}
                />
              </li>
            )
          }
        </ul>
      </div>

    </div>
  );
}

export default RosterGallery

RosterGallery.propTypes = {
  assignSeat: PropTypes.func.isRequired,
  currentOffering: PropTypes.object.isRequired,
  currentStudents: PropTypes.array.isRequired,
  id: PropTypes.string
}