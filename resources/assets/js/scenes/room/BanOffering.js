import React from 'react'
import PropTypes from 'prop-types'
import helpers from '../../bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import InstructorNames from '../../global/InstructorNames'

const BanOffering = ({ currentOffering }) => (
  <div className="banner-text class-banner">
    <h3>
      <FontAwesomeIcon icon={['far', 'users']} />
    </h3>
    <div>
      <h3>{currentOffering.long_title}</h3>
      <p><small>LAWS {currentOffering.catalog_nbr}-{currentOffering.section} &bull; <InstructorNames offering={currentOffering} /> &bull; {helpers.termCodeToString(currentOffering.term_code)}</small></p>
    </div>
  </div>
)

export default BanOffering

BanOffering.propTypes = {
  currentOffering: PropTypes.object.isRequired
}