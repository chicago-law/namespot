import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import helpers from '../../bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import InstructorNames from '../../global/InstructorNames'

const BanOffering = ({ settings, currentOffering }) => (
  <div className="banner-text class-banner">
    <h3>
      <FontAwesomeIcon icon={['far', 'users']} />
    </h3>
    <div>
      <h3>{currentOffering.long_title}</h3>
      <p><small>{settings.catalog_prefix || 'LAWS'} {currentOffering.catalog_nbr}-{currentOffering.section} &bull; <InstructorNames offering={currentOffering} /> &bull; {helpers.termCodeToString(currentOffering.term_code)}</small></p>
    </div>
  </div>
)

function mapStateToProps({ settings }) {
  return {
    settings,
  }
}

export default connect(mapStateToProps)(BanOffering)

BanOffering.propTypes = {
  currentOffering: PropTypes.object.isRequired
}