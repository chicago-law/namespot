/* eslint-disable no-nested-ternary */
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Workspace from './Workspace'
import {
  clearModals,
  fetchTables,
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
  const {
    loading, currentRoom, view,
  } = app
  const { match } = ownProps
  const { params } = match

  // find current room ID either from URL or from currentOffering
  const currentOfferingId = params.offeringId ? params.offeringId : null
  const currentRoomId = params.roomId
    ? params.roomId
    : currentOfferingId
      ? offerings[currentOfferingId]
        ? offerings[currentOfferingId].room_id != null
          ? String(offerings[currentOfferingId].room_id)
          : null
        : null
      : null

  const currentTables = Object.keys(tables).filter(tableId => (
    parseInt(tables[tableId].room_id) === parseInt(currentRoom.id)
  ))

  return {
    loading,
    currentTables,
    currentRoomId,
    currentOfferingId: params.offeringId,
    currentRoom,
    currentOffering: offerings[params.offeringId],
    view,
  }
}

const mapDispatchToProps = dispatch => ({
    clearModals: () => {
      dispatch(clearModals())
    },
    fetchTables: (roomId) => {
      dispatch(fetchTables(roomId))
    },
    findAndSetCurrentRoom: (roomId) => {
      dispatch(findAndSetCurrentRoom(roomId))
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
    requestOffering: (offeringId) => {
      dispatch(requestOffering(offeringId))
    },
    requestRoom: (room_id) => {
      dispatch(requestRoom(room_id))
    },
    requestStudents: (offeringId) => {
      dispatch(requestStudents(offeringId))
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
