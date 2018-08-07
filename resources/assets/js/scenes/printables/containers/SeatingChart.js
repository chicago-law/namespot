import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import SeatingChart from '../SeatingChart'
import { fetchRoom, fetchTables, requestOffering, requestStudents, findAndSetCurrentOffering, findAndSetCurrentRoom, setView } from '../../../actions'

const mapStateToProps = (state, ownProps) => {

  let currentOffering = {}
  if (ownProps.match.params.offeringid != null && Object.keys(state.entities.offerings).length && state.entities.offerings[ownProps.match.params.offeringid]) {
    currentOffering = state.entities.offerings[ownProps.match.params.offeringid]
  }

  // parse any URL parameters
  const urlParams = queryString.parse(ownProps.location.search)
  const withStudents = urlParams.withstudents === 'false' ? false : true

  return {
    currentOffering,
    loading: state.app.loading,
    offeringId: ownProps.match.params.offeringid,
    offerings: state.entities.offerings,
    roomId: ownProps.match.params.roomid,
    rooms: state.entities.rooms,
    seats: state.entities.seats,
    students: state.entities.students,
    tables: state.entities.tables,
    withStudents
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchRoom: id => {
      dispatch(fetchRoom(id))
    },
    fetchTables: id => {
      dispatch(fetchTables(id))
    },
    requestOffering: id => {
      dispatch(requestOffering(id))
    },
    requestStudents: id => {
      dispatch(requestStudents(id))
    },
    findAndSetCurrentOffering: (offeringId) => {
      dispatch(findAndSetCurrentOffering(offeringId))
    },
    findAndSetCurrentRoom: (roomId) => {
      dispatch(findAndSetCurrentRoom(roomId))
    },
    setView: view => {
      dispatch(setView(view))
    }
  }
}

const SeatingChartContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SeatingChart))

export default SeatingChartContainer