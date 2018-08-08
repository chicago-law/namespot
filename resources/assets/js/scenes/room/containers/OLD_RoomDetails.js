import { connect } from 'react-redux'
import RoomDetails from '../RoomDetails'

const mapStateToProps = (state) => {

  // find all tables that belong to this room
  let currentTables = []
  if (state.entities.tables) {
    const allTables = state.entities.tables
    for (let table in allTables) {
      if (allTables.hasOwnProperty(table)) {
        if (allTables[table].room_id === state.app.currentRoom.id) {
          currentTables = [...currentTables, allTables[table]]
        }
      }
    }
  }
  console.log('from room details: ', currentTables)

  // make an array of all the seat IDs at the tables
  let currentSeats = []
  currentTables.forEach(table => {
    for (let i = 0; i < table.seat_count; i++) {
      currentSeats.push(`${table.id}_${i}`)
    }
  })

  return {
    currentSeats,
    currentRoom:state.app.currentRoom,
    currentOffering:state.app.currentOffering
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     //
//   }
// }

const RoomDetailsContainer = connect(
  mapStateToProps,
  // mapDispatchToProps
)(RoomDetails)

export default RoomDetailsContainer