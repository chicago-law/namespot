import { connect } from 'react-redux';
import RoomList from '../RoomList'
import { requestRooms, receiveRooms, setLoadingStatus, setView, requestError } from '../../../actions'

const mapStateToProps = (state) => {
  return {
    rooms: state.entities.rooms,
    loading:state.app.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestRooms: () => {
      dispatch(requestRooms())
    },
    setView: (view) => {
      dispatch(setView(view))
    },
    receiveRooms: rooms => {
      dispatch(receiveRooms(rooms))
    },
    setLoadingStatus:(type, status) => {
      dispatch(setLoadingStatus(type,status))
    },
    requestError: (type, message, shouldLeave) => {
      dispatch(requestError(type, message, shouldLeave));
    }
  }
}

const RoomListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RoomList)

export default RoomListContainer;