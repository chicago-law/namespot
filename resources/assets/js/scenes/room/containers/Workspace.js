import { connect } from 'react-redux'
import Workspace from '../Workspace'
import { withRouter } from 'react-router-dom'
import {
  clearModals ,
  fetchTables,
  findAndSetCurrentOffering,
  findAndSetCurrentRoom,
  resetCurrentOffering,
  resetCurrentRoom,
  requestRoom,
  requestRooms,
  requestOffering,
  requestStudents,
  setCurrentSeatId,
  setCurrentStudentId,
  setPointSelection,
  setModal,
  setTask,
  setView,
} from '../../../actions'

const mapStateToProps = (state, ownProps) => {

  /**
   * We come here with the URL providing either the Room ID or the Offering ID.
   * Either way, we need to load up the offering if possible, definitely the room,
   * and definitely any tables into props
   */

  // find current room ID either from URL or from currentOffering
  const params = ownProps.match.params
  const currentOfferingID = params.offeringID ? params.offeringID : null
  const currentRoomID = params.roomID ? params.roomID : currentOfferingID ? state.entities.offerings[currentOfferingID] ? state.entities.offerings[currentOfferingID].room_id != null ? String(state.entities.offerings[currentOfferingID].room_id) : null : null : null

  // find all tables that belong to this room
  let currentTables = []
  if (state.entities.tables) {
    const allTables = state.entities.tables
    for (let table in allTables) {
      if (allTables.hasOwnProperty(table)) {
        if (allTables[table].room_id === state.app.currentRoom.id) {
          currentTables = [ ...currentTables, allTables[table] ]
        }
      }
    }
  }

  // make an array of all the seats in the current room
  let currentSeats = []
  Object.keys(state.entities.seats).forEach(seatId => {
    state.entities.seats[seatId].room_id === state.app.currentRoom.id ? currentSeats.push(state.entities.seats[seatId]) : false
  })

  // make an array of all the students in the current offering
  let currentStudents = []
  Object.keys(state.entities.students).forEach(studentID => {
    state.app.currentOffering.students.includes(parseInt(studentID)) ? currentStudents.push(state.entities.students[studentID]) : false
  })

  return {
    currentRoomID,
    currentOfferingID,
    currentSeats,
    currentStudents,
    currentTables,
    currentRoom:state.app.currentRoom,
    currentOffering:state.app.currentOffering,
    modals: state.app.modals,
    task:state.app.task,
    view:state.app.view,
    loading:state.app.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearModals: () => {
      dispatch(clearModals())
    },
    fetchTables: (roomID) => {
      dispatch(fetchTables(roomID))
    },
    findAndSetCurrentRoom: (roomID) => {
      dispatch(findAndSetCurrentRoom(roomID))
    },
    findAndSetCurrentOffering: (offeringID) => {
      dispatch(findAndSetCurrentOffering(offeringID))
    },
    setView: (view) => {
      dispatch(setView(view))
    },
    setTask: (task) => {
      dispatch(setTask(task))
    },
    resetCurrentOffering: () => {
      dispatch(resetCurrentOffering())
    },
    resetCurrentRoom: () => {
      dispatch(resetCurrentRoom())
    },
    requestOffering: (offeringID) => {
      dispatch(requestOffering(offeringID))
    },
    requestRoom: (room_id) => {
      dispatch(requestRoom(room_id))
    },
    requestRooms: () => {
      dispatch(requestRooms())
    },
    requestStudents: (offeringID) => {
      dispatch(requestStudents(offeringID))
    },
    setCurrentStudentId: (id) => {
      dispatch(setCurrentStudentId(id))
    },
    setCurrentSeatId: (id) => {
      dispatch(setCurrentSeatId(id))
    },
    setPointSelection: (type) => {
      dispatch(setPointSelection(type))
    },
    setModal: (modal, status) => {
      dispatch(setModal(modal, status))
    }
  }
}

const WorkspaceContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Workspace))

export default WorkspaceContainer