import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PrintOffering from '../PrintOffering'
import { setView, setModal } from '../../../../../actions'

const mapStateToProps = state => ({
    currentRoom: state.app.currentRoom,
    currentOffering: state.app.currentOffering,
  })

const mapDispatchToProps = dispatch => ({
    setView: (view) => {
      dispatch(setView(view))
    },
    setModal: (name, status) => {
      dispatch(setModal(name, status))
    },
  })

const PrintOfferingContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrintOffering))

export default PrintOfferingContainer
