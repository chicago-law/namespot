import { connect } from 'react-redux';
import ActionBarEditRoom from '../ActionBarEditRoom'
import { selectTable, selectPointType, selectPoints } from '../../../actions'

const mapStateToProps = (state, ownProps) => {
  let room = {};
  if (state.entities.rooms[ownProps.match.params.roomID]) {
    room = state.entities.rooms[ownProps.match.params.roomID]
  }
  return {
    room:room,
    match:ownProps.match
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    selectTable: tableID => {
      dispatch(selectTable(tableID))
    },
    selectPointType: type => {
      dispatch(selectPointType(type))
    }
  }
}

const ActionBarEditRoomContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionBarEditRoom)

export default ActionBarEditRoomContainer;