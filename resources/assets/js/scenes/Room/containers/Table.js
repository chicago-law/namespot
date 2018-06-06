import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import Table from '../Table'
import { selectTable , setTask, setPointSelection } from '../../../actions'

const mapStateToProps = (state, ownProps) => {

  // current room ID
  const currentRoomID = ownProps.match.params.roomID;

  // set currentRoom to room corresponding to ID from URL
  let currentRoom = {};
  if (state.entities.rooms[currentRoomID]) {
    currentRoom = state.entities.rooms[currentRoomID]
  }

  return {
    currentRoom,
    tempTable: state.app.tempTable,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    selectTable: (tableID, roomID, seatCount, coords) => {
      dispatch(selectTable(tableID, roomID, seatCount, coords))
    },
    setTask: (task) => {
      dispatch(setTask(task))
    },
    setPointSelection: (pointType) => {
      dispatch(setPointSelection(pointType))
    }
  }
}

const TableContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Table))

export default TableContainer;