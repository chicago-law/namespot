import { connect } from 'react-redux'
import OfferingDetails from '../OfferingDetails'
import {
  assignSeat,
  setTask,
  setCurrentStudentId,
  updateStudent,
} from '../../../actions'

const mapStateToProps = (state) => {

  // get the students enrolled in this class
  const currentStudents = Object.keys(state.entities.students)
    .filter(id => state.app.currentOffering.students.includes(parseInt(id)))
    .map(id => state.entities.students[id])
    .sort((a, b) => b.last_name.toUpperCase() < a.last_name.toUpperCase() ? 1 : -1)

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
    },
    updateStudent: (student_id, attr, value) => {
      dispatch(updateStudent(student_id, attr, value))
    },
  }
}

const OfferingDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OfferingDetails)

export default OfferingDetailsContainer