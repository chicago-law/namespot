import React from 'react';
import PropTypes from 'prop-types';
import helpers from '../../bootstrap';

const BanOffering = ({ currentOffering }) => {
  // create a string from array of instructors
  let instructorString = '';
  currentOffering.instructors.forEach((instructor, index) => {
    index != 0 ? instructorString += ', ' : false;
    instructorString += instructor.first_name + ' ' + instructor.last_name;
  });
  return (
    <div className="banner-text class-banner">
      <h3>{currentOffering.long_title}</h3>
      <p><small>LAWS {currentOffering.catalog_nbr}-{currentOffering.section} &bull; {instructorString} &bull; {helpers.termCodeToString(currentOffering.term_code)}</small></p>
    </div>
  );
}

export default BanOffering

BanOffering.propTypes = {
  currentOffering: PropTypes.object.isRequired
}