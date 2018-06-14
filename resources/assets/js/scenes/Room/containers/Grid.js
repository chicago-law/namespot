import { connect } from 'react-redux';
import Grid from '../Grid'
import { savePointToTempTable } from '../../../actions'

const mapStateToProps = (state, ownProps) => {

  // find all tables that belong to this room
  let currentTables = [];
  if (state.entities.tables) {
    const allTables = state.entities.tables;
    for (let table in allTables) {
      if (allTables.hasOwnProperty(table)) {
        if (allTables[table].room_id == state.app.currentRoom.id) {
          currentTables = [...currentTables, allTables[table]];
        }
      }
    }
  }

  return {
    currentTables,
    pointSelection:state.app.pointSelection,
    tempTable: state.app.tempTable,
    pointSelection:state.app.pointSelection
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

export default GridContainer;