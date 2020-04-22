import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AppState } from '../../store/index'
import { Room } from '../../store/rooms/types'
import Loading from '../Loading'

interface StoreProps {
  room: Room;
}
type Props = StoreProps & StoreProps & RouteComponentProps<{ roomId: string }>

const EditRoomTitles = ({ room }: Props) => {
  if (!room) {
    return <Loading height={1} />
  }

  return (
    <>
      <div className="icon-container">
        <FontAwesomeIcon icon={['far', 'map-marker-alt']} />
      </div>
      <div>
        <h2>{room.name || '(Untitled room)'}</h2>
      </div>
    </>
  )
}

const mapState = ({
  rooms,
}: AppState, { match }: RouteComponentProps<{ roomId: string }>) => ({
  room: rooms[match.params.roomId],
})

export default connect(mapState)(EditRoomTitles)
