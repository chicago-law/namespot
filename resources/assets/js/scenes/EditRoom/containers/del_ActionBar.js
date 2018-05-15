import { connect } from 'react-redux';
import ActionBar from '../ActionBar'

const mapStateToProps = (state, ownProps) => {
  let room = {};
  if (state.entities.rooms[ownProps.roomID]) {
    room = state.entities.rooms[ownProps.roomID]
  }
  return {
    room: room,
    changeMode: ownProps.changeMode
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     onOfferingClick: id => {
//       dispatch(enterOffering(id))
//     }
//   }
// }

const ActionBarContainer = connect(
  mapStateToProps
)(ActionBar)

export default ActionBarContainer;