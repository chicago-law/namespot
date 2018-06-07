import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import AbOfferingOverview from '../AbOfferingOverview';
// import {  } from '../../../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    //
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    //
  }
}

const AbOfferingOverviewContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AbOfferingOverview))

export default AbOfferingOverviewContainer;