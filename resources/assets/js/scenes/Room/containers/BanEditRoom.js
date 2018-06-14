import { connect } from 'react-redux';
import BanEditRoom from '../BanEditRoom'

const mapStateToProps = (state) => {
  return {
    currentRoom:state.app.currentRoom
  }
}

const BanEditRoomContainer = connect(
  mapStateToProps
)(BanEditRoom)

export default BanEditRoomContainer;