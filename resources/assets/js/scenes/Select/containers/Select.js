import { connect } from 'react-redux';
import Select from '../Select';
import { setCurrentRoom, setCurrentOffering, resetCurrentOffering, resetCurrentRoom } from '../../../actions';

const mapStateToProps = (state) => {
  return {
    //
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentRoom: room => {
      dispatch(setCurrentRoom(room));
    },
    setCurrentOffering: offering => {
      dispatch(setCurrentOffering(offering));
    },
    resetCurrentOffering: () => {
      dispatch(resetCurrentOffering())
    },
    resetCurrentRoom: () => {
      dispatch(resetCurrentRoom())
    }
  }
}

const SelectContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Select)

export default SelectContainer;