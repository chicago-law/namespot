import { connect } from 'react-redux';
import ActionBarEditRoom from '../ActionBarEditRoom'

const mapStateToProps = (state, ownProps) => {
  // console.log(ownProps.roomID);
  return {
    room: state.entities.rooms[ownProps.roomID]
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     onOfferingClick: id => {
//       dispatch(enterOffering(id))
//     }
//   }
// }

const ActionBarEditRoomContainer = connect(
  mapStateToProps
)(ActionBarEditRoom)

export default ActionBarEditRoomContainer;