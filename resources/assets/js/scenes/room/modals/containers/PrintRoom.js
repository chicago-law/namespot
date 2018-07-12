import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PrintRoom from '../PrintRoom';
import { setView, setModal } from '../../../../actions';

const mapStateToProps = (state) => {
  return {
    currentRoom: state.app.currentRoom,
    currentOffering: state.app.currentOffering
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setView: view => {
      dispatch(setView(view));
    },
    setModal: (name, status) => {
      dispatch(setModal(name, status));
    }
  }
}

const PrintRoomContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(PrintRoom));

export default PrintRoomContainer;