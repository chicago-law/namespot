import React from 'react'
import { connect } from 'react-redux'
import { setModal } from '../../../actions'

const RoomNotSet = ({ dispatch }) => {
  function onClickToSet() {
    dispatch(setModal('assign-room', true))
  }

  return (
    <div className="room-not-set">
      <p>No room is set yet for this class. <span onClick={onClickToSet}>Choose one now</span></p>
    </div>
  )
}

export default connect()(RoomNotSet)
