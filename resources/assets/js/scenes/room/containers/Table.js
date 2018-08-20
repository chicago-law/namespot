import { connect } from 'react-redux'
import Table from '../Table'
import { selectTable , setTask, setPointSelection, removeTableRequest, receiveSeats, deleteSeats, requestError, removeError } from '../../../actions'

const mapStateToProps = (state) => {

  return {
    currentRoom:state.app.currentRoom,
    currentOffering:state.app.currentOffering,
    seats: state.entities.seats,
    task:state.app.task,
    view: state.app.view,
    tempTable: state.app.tempTable,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectTable: (tableID, roomID, seatCount, labelPosition, coords) => {
      dispatch(selectTable(tableID, roomID, seatCount, labelPosition, coords))
    },
    setTask: (task) => {
      dispatch(setTask(task))
    },
    setPointSelection: (pointType) => {
      dispatch(setPointSelection(pointType))
    },
    removeTableRequest:(tableID) => {
      dispatch(removeTableRequest(tableID))
    },
    receiveSeats: (seats, tableId) => {
      dispatch(receiveSeats(seats, tableId))
    },
    deleteSeats: tableId => {
      dispatch(deleteSeats(tableId))
    },
    requestError: (type, message, shouldLeave) => {
      dispatch(requestError(type, message, shouldLeave))
    },
    removeError: type => {
      dispatch(removeError(type))
    }
  }
}

const TableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Table)

export default TableContainer