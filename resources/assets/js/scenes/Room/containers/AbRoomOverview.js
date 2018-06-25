import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AbRoomOverview from '../AbRoomOverview'
import { newTable, setTask, setPointSelection, setSeatSizeRequest, setView, setModal } from '../../../actions'

const mapStateToProps = (state) => {
  return {
    currentRoom:state.app.currentRoom,
    currentOffering:state.app.currentOffering
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    newTable: () => {
      dispatch(newTable())
    },
    setView: status => {
      dispatch(setView(status))
    },
    setTask: status => {
      dispatch(setTask(status))
    },
    setPointSelection: status => {
      dispatch(setPointSelection(status))
    },
    setSeatSizeRequest: (roomID, seatSize) => {
      dispatch(setSeatSizeRequest(roomID, seatSize))
    },
    setModal: (modal, status) => {
      dispatch(setModal(modal, status));
    }
  }
}

const AbEditRoomContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AbRoomOverview))

export default AbEditRoomContainer;