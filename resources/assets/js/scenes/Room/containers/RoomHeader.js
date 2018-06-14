import { connect } from 'react-redux';
import RoomHeader from '../RoomHeader';

const mapStateToProps = (state) => {
  return {
    currentRoom:state.app.currentRoom,
    currentOffering:state.app.currentOffering
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     //
//   }
// }

const RoomHeaderContainer = connect(
  mapStateToProps,
  // mapDispatchToProps
)(RoomHeader);

export default RoomHeaderContainer;