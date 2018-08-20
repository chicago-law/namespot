import { connect } from 'react-redux'
import Grid from '../Grid'
import { savePointToTempTable } from '../../../actions'

const mapStateToProps = (state) => {

  // find all tables that belong to this room
  let currentTables = []
  if (state.entities.tables) {
    const allTables = state.entities.tables
    for (let table in allTables) {
      if (allTables.hasOwnProperty(table)) {
        if (allTables[table].room_id == state.app.currentRoom.id) {
          currentTables = [...currentTables, allTables[table]]
        }
      }
    }
  }

  return {
    currentTables,
    pointSelection:state.app.pointSelection,
    task: state.app.task,
    tempTable: state.app.tempTable,
    view: state.app.view
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    savePointToTempTable: (id, pointType) => {
      dispatch(savePointToTempTable(id, pointType))
    }
  }
}

const GridContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Grid)

export default GridContainer