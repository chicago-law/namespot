import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Modals from '../Modals'
import { resetCurrentRoom, setModal } from '../../actions'

const mapStateToProps = (state) => {
  return {
    modals: state.app.modals
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetCurrentRoom: () => {
      dispatch(resetCurrentRoom())
    },
    setModal: (modal, status) => {
      dispatch(setModal(modal, status))
    }
  }
}

const ModalsContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Modals))

export default ModalsContainer