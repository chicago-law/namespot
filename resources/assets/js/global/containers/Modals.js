import { connect } from 'react-redux';
import Modals from '../Modals'
import { setModal } from '../../actions'

const mapStateToProps = (state) => {
  return {
    modals:state.app.modals
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setModal: (modal, status) => {
      dispatch(setModal(modal, status))
    }
  }
}

const ModalsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Modals)

export default ModalsContainer;