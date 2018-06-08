import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import Table from '../Table'
import { selectTable , setTask, setPointSelection, removeTableRequest } from '../../../actions'

const mapStateToProps = (state, ownProps) => {

  return {
    currentRoom:state.app.currentRoom,
    task:state.app.task,
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
    },
    removeTableRequest:(tableID) => {
      dispatch(removeTableRequest(tableID))
    }
  }
}

const TableContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Table))

export default TableContainer;