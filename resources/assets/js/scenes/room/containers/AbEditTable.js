import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import AbEditTable from '../AbEditTable'
import { saveNewTable, clearTempTable, setTask, setPointSelection, setSeatCount, requestError, setModal, savePointToTempTable } from '../../../actions'

const mapStateToProps = (state) => {
  return {
    currentRoom:state.app.currentRoom,
    modals: state.app.modals,
    view:state.app.view,
    task:state.app.task,
    tempTable:state.app.tempTable,
    pointSelection:state.app.pointSelection,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveNewTable: (tableID, roomID, coords, seatCount, labelPosition) => {
      dispatch(saveNewTable(tableID, roomID, coords, seatCount, labelPosition))
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
    },
    requestError: (type, message, shouldLeave) => {
      dispatch(requestError(type, message, shouldLeave))
    },
    savePointToTempTable: (pointKey, pointType) => {
      dispatch(savePointToTempTable(pointKey, pointType))
    },
    setModal: (type, status) => {
      dispatch(setModal(type, status))
    }
  }
}

const AbEditTableContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AbEditTable))

export default AbEditTableContainer