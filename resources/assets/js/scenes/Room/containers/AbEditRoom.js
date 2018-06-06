import { connect } from 'react-redux';
import AbEditRoom from '../AbEditRoom'
import { newTable, setTask, setPointSelection, setSeatSizeRequest } from '../../../actions'

const mapStateToProps = (state, ownProps) => {
  let currentRoom = {};
  if (state.entities.rooms[ownProps.match.params.roomID]) {
    currentRoom = state.entities.rooms[ownProps.match.params.roomID]
  }
  return {
    currentRoom:currentRoom,
    match:ownProps.match
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

const AbEditRoomContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AbEditRoom)

export default AbEditRoomContainer;