import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SeatingChart from '../SeatingChart'
import { fetchRoom, fetchTables, requestOffering, requestStudents, findAndSetCurrentOffering, findAndSetCurrentRoom } from '../../../actions';

const mapStateToProps = (state, ownProps) => {
  return {
    roomId: ownProps.match.params.roomid,
    offeringId: ownProps.match.params.offeringid,
    rooms: state.entities.rooms,
    offerings: state.entities.offerings,
    students: state.entities.students,
    tables: state.entities.tables
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchRoom: id => {
      dispatch(fetchRoom(id));
    },
    fetchTables: id => {
      dispatch(fetchTables(id));
    },
    requestOffering: id => {
      dispatch(requestOffering(id));
    },
    requestStudents: id => {
      dispatch(requestStudents(id));
    },
    findAndSetCurrentOffering: (offeringId) => {
      dispatch(findAndSetCurrentOffering(offeringId));
    },
    findAndSetCurrentRoom: (roomId) => {
      dispatch(findAndSetCurrentRoom(roomId));
    },
  }
}

const SeatingChartContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SeatingChart));

export default SeatingChartContainer;