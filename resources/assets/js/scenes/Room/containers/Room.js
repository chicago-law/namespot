import { connect } from 'react-redux';
import Room from '../Room'
import { withRouter } from 'react-router'
import { fetchTables, setTask, findAndSetCurrentRoom, findAndSetCurrentOffering, requestRooms } from '../../../actions'

const mapStateToProps = (state, ownProps) => {

  /**
   * We come here with the URL providing either the Room ID or the Offering ID.
   * Either way, we need to load up the offering if possible, definitely the room,
   * and definitely any tables into props
   */

  // find current room ID either from URL or from currentOffering
  const params = ownProps.match.params;
  const currentOfferingID = params.offeringID ? params.offeringID : null;
  const currentRoomID = params.roomID ? params.roomID : currentOfferingID ? state.entities.offerings[currentOfferingID] ? state.entities.offerings[currentOfferingID].room_id : null : null;

  // find all tables that belong to this room
  let currentTables = [];
  if (state.entities.tables) {
    const allTables = state.entities.tables;
    for (let table in allTables) {
      if (allTables.hasOwnProperty(table)) {
        if (allTables[table].room_id == currentRoomID) {
          currentTables = [ ...currentTables, allTables[table] ];
        }
      }
    }
  }

  return {
    currentRoomID,
    currentOfferingID,
    currentTables,
    currentRoom:state.app.currentRoom,
    currentOffering:state.app.currentOffering,
    task:state.app.task,
    tempTable:state.app.tempTable,
    pointSelection:state.app.pointSelection,
    loading:state.app.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTables: (roomID) => {
      dispatch(fetchTables(roomID))
    },
    setTask: (task) => {
      dispatch(setTask(task))
    },
    findAndSetCurrentRoom: (roomID) => {
      dispatch(findAndSetCurrentRoom(roomID))
    },
    findAndSetCurrentOffering: (offeringID) => {
      dispatch(findAndSetCurrentOffering(offeringID))
    },
    requestRooms: () => {
      dispatch(requestRooms())
    }
  }
}

const RoomContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Room))

export default RoomContainer;