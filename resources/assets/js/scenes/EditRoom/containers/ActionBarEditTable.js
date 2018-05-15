import { connect } from 'react-redux';
import ActionBarEditTable from '../ActionBarEditTable'
import { selectPointType, saveTable } from '../../../actions'

const mapStateToProps = (state, ownProps) => {
  let room = {};
  if (state.entities.rooms[ownProps.match.params.roomID]) {
    room = state.entities.rooms[ownProps.match.params.roomID]
  }
  return {
    room: room,
    newTable:state.newTable
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectPointType: type => {
      dispatch(selectPointType(type))
    },
    saveTable: (tableID, roomID, seatCount) => {
      dispatch(saveTable(tableID, roomID, seatCount))
    }
  }
}

const ActionBarEditTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionBarEditTable)

export default ActionBarEditTableContainer;