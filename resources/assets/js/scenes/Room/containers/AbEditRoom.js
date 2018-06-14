import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AbEditRoom from '../AbEditRoom'
import { newTable, setTask, setPointSelection, setSeatSizeRequest, setLoadingStatus } from '../../../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    currentRoom:state.app.currentRoom,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    newTable: () => {
      dispatch(newTable())
    },
    setTask: status => {
      dispatch(setTask(status))
    },
    setPointSelection: status => {
      dispatch(setPointSelection(status))
    },
    setSeatSizeRequest: (roomID, seatSize) => {
      dispatch(setSeatSizeRequest(roomID, seatSize))
    }
  }
}

const AbEditRoomContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AbEditRoom))

export default AbEditRoomContainer;