import { connect } from 'react-redux';
import EditRoom from '../EditRoom'

const mapStateToProps = (state) => {
  return {
    rooms:state.entities.rooms
  }
}

const EditRoomContainer = connect(
  mapStateToProps
)(EditRoom)

export default EditRoomContainer;