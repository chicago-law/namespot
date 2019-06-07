import React from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import helpers from '../../../bootstrap'
import InstructorNames from '../../InstructorNames'
import Loading from '../../Loading'

const BanOffering = ({
 loading, settings, currentOffering, currentOfferingId,
}) => {
  if (currentOfferingId && (
    loading.offerings
    || !('offerings' in loading)
  )) {
    return <Loading />
  }
  return (
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
}

const mapStateToProps = ({ app, entities, settings }, { match }) => ({
  currentOfferingId: match.params.offeringId,
  currentOffering: entities.offerings[match.params.offeringId],
  loading: app.loading,
  settings,
})

export default connect(mapStateToProps)(BanOffering)
