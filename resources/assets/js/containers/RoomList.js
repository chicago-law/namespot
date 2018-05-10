import { connect } from 'react-redux';
import RoomList from '../components/RoomList'

const mapStateToProps = (state) => {
  return {
    rooms: state.entities.rooms,
  }
}

const RoomListContainer = connect(
  mapStateToProps
)(RoomList)

export default RoomListContainer;