import { connect } from 'react-redux'
import OfferingDetails from '../OfferingDetails'
import { assignSeat, setTask, setCurrentStudentId } from '../../../actions'

const mapStateToProps = (state) => {

  // get the students enrolled in this class
  let currentStudents = []
  Object.keys(state.entities.students).forEach(studentID => {
    if (state.app.currentOffering.students.includes(parseInt(studentID))) {
      currentStudents.push(state.entities.students[studentID])
    }
  })

  // get the tables for the current room
  const currentTables = []
  Object.keys(state.entities.tables).forEach(tableId => {
    state.entities.tables[tableId].room_id == state.app.currentOffering.room_id && currentTables.push(state.entities.tables[tableId])
  })

  // make an array of all the seat IDs at the tables
  let currentSeats = []
  currentTables.forEach(table => {
    for (let i = 0; i < table.seat_count; i++) {
      currentSeats.push(`${table.id}_${i}`)
    }
  })

  return {
    currentOffering: state.app.currentOffering,
    currentRoom: state.app.currentRoom,
    currentSeats,
    currentStudents
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    assignSeat: (offering_id, student_id, seat_i) => {
      dispatch(assignSeat(offering_id, student_id, seat_i))
    },
    setTask: task => {
      dispatch(setTask(task))
    },
    setCurrentStudentId: id => {
      dispatch(setCurrentStudentId(id))
    }
  }
}

const OfferingDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OfferingDetails)

export default OfferingDetailsContainer