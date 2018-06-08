import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import RoomHeader from '../RoomHeader';

const mapStateToProps = (state, ownProps) => {
  return {
    currentRoom:state.app.currentRoom,
    currentOffering:state.app.currentOffering
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    //
  }
}

const RoomHeaderContainer = withRouter(connect(mapStateToProps,mapDispatchToProps)(RoomHeader));
export default RoomHeaderContainer;