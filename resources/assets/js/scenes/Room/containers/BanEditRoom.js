import { connect } from 'react-redux';
import BanEditRoom from '../BanEditRoom'

const mapStateToProps = (state, ownProps) => {
  return {
    rooms: state.entities.rooms,
    match:ownProps.match
  }
}

const BanEditRoomContainer = connect(
  mapStateToProps
)(BanEditRoom)

export default BanEditRoomContainer;