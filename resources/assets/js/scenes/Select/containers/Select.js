import { connect } from 'react-redux';
import Select from '../Select';
import { resetCurrentOffering, resetCurrentRoom, setCurrentStudentId, setCurrentSeatId } from '../../../actions';

const mapStateToProps = (state) => {
  return {
    //
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetCurrentOffering: () => {
      dispatch(resetCurrentOffering())
    },
    resetCurrentRoom: () => {
      dispatch(resetCurrentRoom())
    },
    setCurrentStudentId: (id) => {
      dispatch(setCurrentStudentId(id))
    },
    setCurrentSeatId: (id) => {
      dispatch(setCurrentSeatId(id))
    }
  }
}

const SelectContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Select)

export default SelectContainer;