import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ChangeRoom from '../ChangeRoom'
import {
 setModal, requestUpdateOffering, requestRooms, setView, setTask,
} from '../../../../../actions'

const mapStateToProps = ({ entities, app }, { match }) => ({
    rooms: entities.rooms,
    currentRoom: app.currentRoom,
    currentOffering: entities.offerings[match.params.offeringId],
    loading: app.loading,
  })

const mapDispatchToProps = dispatch => ({
    setModal: (modal, status) => {
      dispatch(setModal(modal, status))
    },
    requestUpdateOffering: (offering_id, attribute, value) => {
      dispatch(requestUpdateOffering(offering_id, attribute, value))
    },
    requestRooms: () => {
      dispatch(requestRooms())
    },
    setView: (view) => {
      dispatch(setView(view))
    },
    setTask: (task) => {
      dispatch(setTask(task))
    },
  })

const ChangeRoomContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangeRoom))

export default ChangeRoomContainer
