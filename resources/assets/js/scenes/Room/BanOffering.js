import React from 'react'

const BanOffering = ({ currentOffering }) => {
  if (currentOffering) {
    // create a string from array of instructors
    let instructorString = '';
    currentOffering.instructors.forEach((instructor, index) => {
      index != 0 ? instructorString += ', ' : false;
      instructorString += instructor.first_name + ' ' + instructor.last_name;
    });
    return (
      <div className="banner-text class-banner">
        <h3>{currentOffering.name}</h3>
        <p><small>LAWS {currentOffering.course_num} &bull; {instructorString} &bull; Spring 2018</small></p>
      </div>
    );
  } else {
    return (
      <div className="banner-text"></div>
    )
  }
}

export default BanOffering