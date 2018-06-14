import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AbEditTable from '../AbEditTable';
import { saveTable, clearTempTable, setTask, setPointSelection, setSeatCount } from '../../../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    currentRoom:state.app.currentRoom,
    view:state.app.view,
    task:state.app.task,
    tempTable:state.app.tempTable,
    pointSelection:state.app.pointSelection,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveTable: (tableID, roomID, coords, seatCount) => {
      dispatch(saveTable(tableID, roomID, coords, seatCount))
    },
    clearTempTable: () => {
      dispatch(clearTempTable())
    },
    setTask: status => {
      dispatch(setTask(status))
    },
    setPointSelection: status => {
      dispatch(setPointSelection(status))
    },
    setSeatCount:count => {
      dispatch(setSeatCount(count))
    }
  }
}

const AbEditTableContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AbEditTable))

export default AbEditTableContainer;