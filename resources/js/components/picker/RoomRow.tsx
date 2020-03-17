import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AppState } from '../../store'
import { Room } from '../../store/rooms/types'
import IconButton from '../IconButton'
import { theme } from '../../utils/theme'
import { setModal } from '../../store/modal/actions'
import { ModalTypes } from '../../store/modal/types'

interface StoreProps {
  room: Room;
  setModal: typeof setModal;
}
interface OwnProps {
  roomId: string;
}

const RoomRow = ({ room, setModal }: StoreProps & OwnProps) => {
  function handleDelete() {
    setModal(ModalTypes.deleteRoom, {
      roomId: room.id,
    })
  }

  return (
    <li>
      <Link to={`/rooms/${room.id}`}>
        <h3>{room.name || '(Untitled room)'}</h3>
      </Link>
      <div className="delete">
        <IconButton
          icon={['far', 'trash-alt']}
          handler={handleDelete}
          iconSize={-0.5}
          iconColor={theme.middleGray}
        />
      </div>
      <FontAwesomeIcon icon={['far', 'chevron-right']} />
    </li>
  )
}

const mapState = ({ rooms }: AppState, { roomId }: OwnProps) => ({
  room: rooms[roomId],
})

export default connect(mapState, {
  setModal,
})(RoomRow)
