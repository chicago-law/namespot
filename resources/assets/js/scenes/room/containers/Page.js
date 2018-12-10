import { connect } from 'react-redux'
import Page from '../Page'
import { withRouter } from 'react-router-dom'
import { fetchTables, setView, setTask, findAndSetCurrentRoom, findAndSetCurrentOffering, requestRooms, requestRoom, requestStudents, assignSeat, requestOffering, resetCurrentOffering, resetCurrentRoom, setCurrentStudentId, setCurrentSeatId, setModal, clearModals } from '../../../actions'

const mapStateToProps = (state, ownProps) => {

  /**
   * We come here with the URL providing either the Room ID or the Offering ID.
   * Either way, we need to load up the offering if possible, definitely the room,
   * and definitely any tables into props
   */

  // find current room ID either from URL or from currentOffering
  const params = ownProps.match.params
  const currentOfferingID = params.offeringID ? params.offeringID : null
  const currentRoomID = params.roomID ? params.roomID : currentOfferingID ? state.entities.offerings[currentOfferingID] ? state.entities.offerings[currentOfferingID].room_id != null ? String(state.entities.offerings[currentOfferingID].room_id) : null : null : null

  // find all tables that belong to this room
  const { tables } = state.entities
  const { currentRoom } = state.app

  let currentTables = []
  Object.keys(tables).forEach(tableId => {
    if ( parseInt(tables[tableId].room_id) === parseInt(currentRoom.id) ) {
      currentTables.push(tables[tableId])
    }
  })


  // make an array of all the seats in the current room
  let currentSeats = []
  Object.keys(state.entities.seats).forEach(seatId => {
    state.entities.seats[seatId].room_id === state.app.currentRoom.id ? currentSeats.push(state.entities.seats[seatId]) : false
  })

  // make an array of all the students in the current offering
  let currentStudents = []
  Object.keys(state.entities.students).forEach(studentID => {
    state.app.currentOffering.students.includes(parseInt(studentID)) ? currentStudents.push(state.entities.students[studentID]) : false
  })

  // Sometimes we might want to render Page without students, even if there are indeed
  // students enrolled (such as printing a blank seating chart). In this case, the withStudents
  // prop will be passed down from parent and set to false. Here we are defaulting to
  // true unless we find this prop and it is set to false. This is then passed to Seat component,
  // which decides what to show partly based on this property.
  const withStudents = ownProps.hasOwnProperty('withStudents') && ownProps.withStudents === false ? false : true

  return {
    currentRoomID,
    currentRoom: state.app.currentRoom,
    currentOffering: state.app.currentOffering,
    currentOfferingID,
    currentSeats,
    currentStudents,
    currentTables,
    loading: state.app.loading,
    modals: state.app.modals,
    pointSelection: state.app.pointSelection,
    settings: state.settings,
    task: state.app.task,
    tempTable: state.app.tempTable,
    view: state.app.view,
    withStudents
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setView: (view) => {
      dispatch(setView(view))
    },
    setTask: (task) => {
      dispatch(setTask(task))
    },
    fetchTables: (roomID) => {
      dispatch(fetchTables(roomID))
    },
    findAndSetCurrentRoom: (roomID) => {
      dispatch(findAndSetCurrentRoom(roomID))
    },
    findAndSetCurrentOffering: (offeringID) => {
      dispatch(findAndSetCurrentOffering(offeringID))
    },
    requestRooms: () => {
      dispatch(requestRooms())
    },
    requestOffering: (offeringID) => {
      dispatch(requestOffering(offeringID))
    },
    requestStudents: (offeringID) => {
      dispatch(requestStudents(offeringID))
    },
    assignSeat: (offering_id, student_id, seat_id) => {
      dispatch(assignSeat(offering_id, student_id, seat_id))
    },
    resetCurrentRoom: () => {
      dispatch(resetCurrentRoom())
    },
    resetCurrentOffering: () => {
      dispatch(resetCurrentOffering())
    },
    setCurrentStudentId: (id) => {
      dispatch(setCurrentStudentId(id))
    },
    setCurrentSeatId: (id) => {
      dispatch(setCurrentSeatId(id))
    },
    requestRoom: (room_id) => {
      dispatch(requestRoom(room_id))
    },
    setModal: (modal, status) => {
      dispatch(setModal(modal, status))
    },
    clearModals: () => {
      dispatch(clearModals())
    }
  }
}

const PageContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Page))

export default PageContainer