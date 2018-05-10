import { connect } from 'react-redux';
import EditRoomBanner from '../components/EditRoomBanner'

const mapStateToProps = (state, ownProps) => {
  return {
    rooms: state.entities.rooms,
    match:ownProps.match
  }
}

const EditRoomBannerContainer = connect(
  mapStateToProps
)(EditRoomBanner)

export default EditRoomBannerContainer;