import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AbOfferingOverview from '../AbOfferingOverview';
import { setTask, customizeOfferingRoom, setView, setModal } from '../../../actions'

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
    },
    setModal: (modal, status) => {
      dispatch(setModal(modal, status));
    }
  }
}

const AbOfferingOverviewContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AbOfferingOverview))

export default AbOfferingOverviewContainer;