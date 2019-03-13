import React from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import helpers from '../../../bootstrap'
import InstructorNames from '../../InstructorNames'

const BanOffering = ({ settings, currentOffering }) => (
  <div className="banner-text class-banner">
    <h3>
      <FontAwesomeIcon icon={['far', 'users']} />
    </h3>
    <div>
      <h3>{currentOffering.long_title}</h3>
      <p>
        <small>
          {settings.catalog_prefix || 'LAWS'}
          &nbsp;{currentOffering.catalog_nbr} {currentOffering.section && ` - Section ${currentOffering.section}`}
          &nbsp;&bull; <InstructorNames offering={currentOffering} />
          {currentOffering.term_code && ` • ${helpers.termCodeToString(currentOffering.term_code)}`}
        </small>
      </p>
    </div>
  </div>
)

const mapStateToProps = ({ app, settings }) => ({
  currentOffering: app.currentOffering,
  settings,
})

export default connect(mapStateToProps)(BanOffering)
