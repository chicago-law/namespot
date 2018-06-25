import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ChangeRoom from '../ChangeRoom';
import { setModal, requestUpdateOfferingRoom, requestRooms } from '../../../../actions';

const mapStateToProps = (state) => {

  // const rooms = Object.keys(state.entities.rooms).filter(roomId => state.entities.rooms[roomId].type === 'template');

  return {
    rooms:state.entities.rooms,
    currentRoom:state.app.currentRoom,
    currentOffering:state.app.currentOffering,
    loading:state.app.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setModal: (modal, status) => {
      dispatch(setModal(modal, status))
    },
    requestUpdateOfferingRoom: (offering_id, room_id) => {
      dispatch(requestUpdateOfferingRoom(offering_id, room_id))
    },
    requestRooms: () => {
      dispatch(requestRooms());
    }
  }
}

const ChangeRoomContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeRoom));

export default ChangeRoomContainer;