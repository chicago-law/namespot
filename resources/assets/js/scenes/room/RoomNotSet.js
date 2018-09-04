import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setModal } from '../../actions'

class RoomNotSet extends Component {
  onClickToSet = () => {
    this.props.dispatch(setModal('assign-room', true))
  }

  render() {
    return (
      <div className='room-not-set'>
        <p>No room is set yet for this class. <span onClick={this.onClickToSet}>Click here to choose one</span></p>
      </div>
    )
  }
}

export default connect()(RoomNotSet)