import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AbOfferingOverview from '../AbOfferingOverview';
import { setTask } from '../../../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    task:state.app.task
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setTask: (task) => {
      dispatch(setTask(task))
    }
  }
}

const AbOfferingOverviewContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AbOfferingOverview))

export default AbOfferingOverviewContainer;