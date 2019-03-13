/* eslint-disable no-nested-ternary */
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Workspace from './Workspace'
import {
  clearModals,
  fetchTables,
  findAndSetCurrentOffering,
  findAndSetCurrentRoom,
  resetCurrentOffering,
  resetCurrentRoom,
  requestRoom,
  requestOffering,
  requestStudents,
  setCurrentSeatId,
  setCurrentStudentId,
  setPointSelection,
  setTask,
  setView,
} from '../../../actions'

const mapStateToProps = (state, ownProps) => {
  /**
   * We come here with the URL providing either the Room ID or the Offering ID.
   * Either way, we need to load up the offering if possible, definitely the room,
   * and definitely any tables into props
   */
  const { entities, app } = state
  const { offerings, tables } = entities
  const { currentRoom, currentOffering, view } = app
  const { match } = ownProps
  const { params } = match

  // find current room ID either from URL or from currentOffering
  const currentOfferingID = params.offeringID ? params.offeringID : null
  const currentRoomID = params.roomID
    ? params.roomID
    : currentOfferingID
      ? offerings[currentOfferingID]
        ? offerings[currentOfferingID].room_id != null
          ? String(offerings[currentOfferingID].room_id)
          : null
        : null
      : null

  const currentTables = Object.keys(tables).filter(tableId => (
    parseInt(tables[tableId].room_id) === parseInt(currentRoom.id)
  ))

  return {
    currentTables,
    currentRoomID,
    currentOfferingID,
    currentRoom,
    currentOffering,
    view,
  }
}

const mapDispatchToProps = dispatch => ({
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
  })

const WorkspaceContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Workspace))

export default WorkspaceContainer
