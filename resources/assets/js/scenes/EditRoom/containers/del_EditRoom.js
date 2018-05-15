import { connect } from 'react-redux';
import EditRoom from '../EditRoom'

const mapStateToProps = (state, ownProps) => {
  let room = {};
  if (state.entities.rooms[ownProps.match.params.id]) {
    room = state.entities.rooms[ownProps.match.params.id]
  }
  return {
    room:room
  }
}

const EditRoomContainer = connect(
  mapStateToProps
)(EditRoom)

export default EditRoomContainer;