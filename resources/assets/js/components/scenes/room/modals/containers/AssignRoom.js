import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import AssignRoom from '../AssignRoom'
import {
 setModal, requestUpdateOffering, requestRooms, setView, setTask,
} from '../../../../../actions'

const mapStateToProps = ({ app, entities }, { match }) => ({
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

const AssignRoomContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssignRoom))

export default AssignRoomContainer
