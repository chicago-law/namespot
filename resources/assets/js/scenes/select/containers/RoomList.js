import { connect } from 'react-redux'
import RoomList from '../RoomList'
import {
  findAndSetCurrentRoom,
  receiveRooms,
  requestError,
  requestRooms,
  setLoadingStatus,
  setModal,
  setView
} from '../../../actions'

const mapStateToProps = (state) => {
  return {
    rooms: state.entities.rooms,
    loading:state.app.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    findAndSetCurrentRoom: (roomId) => {
      dispatch(findAndSetCurrentRoom(roomId))
    },
    receiveRooms: rooms => {
      dispatch(receiveRooms(rooms))
    },
    requestError: (type, message, shouldLeave) => {
      dispatch(requestError(type, message, shouldLeave))
    },
    requestRooms: () => {
      dispatch(requestRooms())
    },
    setLoadingStatus:(type, status) => {
      dispatch(setLoadingStatus(type,status))
    },
    setModal: (type, status) => {
      dispatch(setModal(type, status))
    },
    setView: (view) => {
      dispatch(setView(view))
    }
  }
}

const RoomListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RoomList)

export default RoomListContainer