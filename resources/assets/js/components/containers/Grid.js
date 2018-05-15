import { connect } from 'react-redux';
import Grid from '../Grid'
import { selectPoints } from '../../actions'

const mapStateToProps = (state, ownProps) => {
  const currentRoomID = ownProps.match.params.roomID;
  let room = {};
  if (state.entities.rooms[currentRoomID]) {
    room = state.entities.rooms[currentRoomID]
  }
  let relevantTables = [];
  if (state.entities.tables) {
    const allTables = state.entities.tables;
    for (let table in allTables) {
      if (allTables.hasOwnProperty(table)) {
        if (allTables[table].roomID == currentRoomID) {
          relevantTables = [ ...relevantTables, allTables[table] ]
        }
      }
    }
  }
  return {
    room:room,
    newTable:state.newTable,
    tables:relevantTables
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectPoints: (x, y, type) => {
      dispatch(selectPoints(x, y, type))
    }
  }
}

const GridContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Grid)

export default GridContainer;