import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PrintOffering from '../PrintOffering'
import { setView, setModal } from '../../../../../actions'

const mapStateToProps = ({ app, entities }, { match }) => ({
    currentRoom: app.currentRoom,
    currentOffering: entities.offerings[match.params.offeringId],
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
