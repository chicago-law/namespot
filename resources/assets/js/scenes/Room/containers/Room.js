import { connect } from 'react-redux';
import Room from '../Room'
import { withRouter } from 'react-router'
import { fetchTables, setTask } from '../../../actions'

const mapStateToProps = (state, ownProps) => {

  // current room ID
  const currentRoomID = ownProps.match.params.roomID;

  // find the current room
  let currentRoom = {};
  if (state.entities.rooms[currentRoomID]) {
    currentRoom = state.entities.rooms[currentRoomID]
  }

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
    currentRoom,
    currentTables,
    task:state.app.task,
    tempTable:state.app.tempTable,
    pointSelection:state.app.pointSelection
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // savePointToTempTable: (key, pointType) => {
    //   dispatch(selectPoint(key, pointType))
    // },
    fetchTables:(roomID) => {
      dispatch(fetchTables(roomID))
    },
    setTask:(task) => {
      dispatch(setTask(task))
    }
  }
}

const RoomContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Room))

export default RoomContainer;