import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AbRoomOverview from '../AbRoomOverview';
import { newTable, setTask, setPointSelection, requestRoomUpdate, setView, setModal, requestError, removeError } from '../../../actions';

const mapStateToProps = (state) => {

  const tablesIdArray = Object.keys(state.entities.tables).filter(id => state.entities.tables[id].room_id === state.app.currentRoom.id);
  let seatCount = 0;
  tablesIdArray.forEach(id => seatCount += state.entities.tables[id].seat_count);

  return {
    currentRoom:state.app.currentRoom,
    currentOffering:state.app.currentOffering,
    rooms:state.entities.rooms,
    seatCount
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
    requestRoomUpdate: (roomID, key, value) => {
      dispatch(requestRoomUpdate(roomID, key, value))
    },
    setModal: (modal, status) => {
      dispatch(setModal(modal, status));
    },
    requestError: (name, message, shouldLeave) => {
      dispatch(requestError(name, message, shouldLeave));
    },
    removeError: (name) => {
      dispatch(removeError(name))
    }
  }
}

const AbEditRoomContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AbRoomOverview))

export default AbEditRoomContainer;