import { connect } from 'react-redux';
import EditRoomDefault from '../../components/actionbar/EditRoomDefault'

const mapStateToProps = (state) => {
  return {
    rooms: state.entities.rooms,
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     onOfferingClick: id => {
//       dispatch(enterOffering(id))
//     }
//   }
// }

const EditRoomDefaultContainer = connect(
  mapStateToProps
)(EditRoomDefault)

export default EditRoomDefaultContainer;