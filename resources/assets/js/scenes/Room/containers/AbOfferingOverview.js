import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AbOfferingOverview from '../AbOfferingOverview';
import { setTask, customizeOfferingRoom, setView } from '../../../actions'

const mapStateToProps = (state) => {
  return {
    currentRoom:state.app.currentRoom,
    currentOffering:state.app.currentOffering,
    task:state.app.task,
    loading:state.app.loading,
    view: state.app.view
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setTask: (task) => {
      dispatch(setTask(task))
    },
    customizeOfferingRoom: (offering_id) => {
      dispatch(customizeOfferingRoom(offering_id))
    },
    setView: (view) => {
      dispatch(setView(view));
    }
  }
}

const AbOfferingOverviewContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AbOfferingOverview))

export default AbOfferingOverviewContainer;