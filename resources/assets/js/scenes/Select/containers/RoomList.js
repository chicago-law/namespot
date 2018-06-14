import { connect } from 'react-redux';
import RoomList from '../RoomList'
import { requestRooms, setView } from '../../../actions'

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
    }
  }
}

const RoomListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RoomList)

export default RoomListContainer;