import { connect } from 'react-redux';
import LabelPosition from '../LabelPosition';
import { setModal, setLabelPosition } from '../../../../actions';

const mapStateToProps = (state) => {

  return {
    tempTable: state.app.tempTable,
    modals: state.app.modals
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setModal: (modal, status) => {
      dispatch(setModal(modal, status))
    },
    setLabelPosition: position => {
      dispatch(setLabelPosition(position))
    }
  }
}

const LabelPositionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LabelPosition);

export default LabelPositionContainer;