import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

const InstructorNames = ({ offering }) => {
  if (!offering.instructors.length) {
    return <Fragment>(no instructors found)</Fragment>
  }

  let inst = ''
  offering.instructors.forEach((instructor, index) => {
    index != 0 ? inst += ', ' : false
    inst += instructor.first_name + ' ' + instructor.last_name
  })

  return <Fragment>{inst}</Fragment>
}

export default InstructorNames

InstructorNames.propTypes = {
  offering: PropTypes.object.isRequired
}