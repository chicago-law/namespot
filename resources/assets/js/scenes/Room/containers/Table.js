import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import Table from '../Table'
import { selectTable , setTask, setPointSelection, removeTableRequest, setCurrentSeatId, setCurrentStudentId } from '../../../actions'

const mapStateToProps = (state) => {

  let currentStudents = [];
  Object.keys(state.entities.students).forEach(studentID => state.entities.students[studentID].seats.hasOwnProperty(`offering_${state.app.currentOffering.id}`) ? currentStudents.push(state.entities.students[studentID]) : false );

  return {
    currentStudents,
    currentRoom:state.app.currentRoom,
    currentOffering:state.app.currentOffering,
    currentSeatId:state.app.currentSeatId,
    currentStudentId: state.app.currentStudentId,
    task:state.app.task,
    tempTable: state.app.tempTable,
  }
}

const mapDispatchToProps = (dispatch) => {
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
    },
    setCurrentSeatId: (seatID) => {
      dispatch(setCurrentSeatId(seatID))
    },
    setCurrentStudentId: (studentID) => {
      dispatch(setCurrentStudentId(studentID))
    }
  }
}

const TableContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Table))

export default TableContainer;