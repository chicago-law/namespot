import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { RouteComponentProps } from 'react-router-dom'
import { AppState } from '../../store'
import { getAllRooms, createRoom } from '../../store/rooms/actions'
import { RoomsState } from '../../store/rooms/types'
import { SessionState } from '../../store/session/types'
import RoomRow from './RoomRow'

interface StoreProps {
  rooms: RoomsState;
  session: SessionState;
  getAllRooms: typeof getAllRooms;
  createRoom: () => Promise<string>;
}

const PickRoom = ({
  rooms,
  session,
  getAllRooms,
  createRoom,
  history,
}: StoreProps & RouteComponentProps) => {
  useEffect(() => {
    if (!session.roomTemplatesReceived) {
      getAllRooms()
    }
  }, [])

  async function handleCreateRoom() {
    const newRoomId = await createRoom()
    history.push(`/rooms/${newRoomId}`)
  }

  return (
    <div>
      <h4>Select Room</h4>
      <ul>
        <li>
          <button type="button" onClick={handleCreateRoom}>
            <h3><FontAwesomeIcon icon={['far', 'plus-circle']} style={{ marginRight: '0.5em' }} />Create New Room</h3>
          </button>
        </li>
        {Object.keys(rooms)
          .filter((roomId) => {
            const room = rooms[roomId]
            return room && room.type === 'template'
          })
          .sort((aId, bId) => {
            const roomA = rooms[aId]
            const roomB = rooms[bId]
            const roomAName = (roomA && roomA.name && roomA.name.toUpperCase()) || ''
            const roomBName = (roomB && roomB.name && roomB.name.toUpperCase()) || ''
            return roomAName > roomBName ? 1 : -1
          })
          .map((roomId) => (
            <RoomRow key={roomId} roomId={roomId} />
          ))}
      </ul>
    </div>
  )
}

const mapState = ({ rooms, session, loading }: AppState) => ({
  rooms,
  session,
})

export default connect(mapState, {
  getAllRooms,
  createRoom,
})(PickRoom)
