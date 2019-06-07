import React, { Component, Fragment } from 'react'
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import _throttle from 'lodash/throttle'
import EditableText from '../../EditableText'
import AbDivider from '../../AbDivider'
import helpers from '../../../bootstrap'
import {
  newTable,
  setTask,
  setPointSelection,
  requestRoomUpdate,
  setView,
  setModal,
} from '../../../actions'

class AbRoomOverview extends Component {
  constructor(props) {
    super(props)
    const { dispatch, currentRoom } = this.props
    this.throttledSeatSizeChange = _throttle((e) => {
      dispatch(requestRoomUpdate(currentRoom.id, 'seat_size', e.target.value))
    }, 750)
    this.state = {
      seatSize: currentRoom.seat_size || '',
    }
  }

  componentDidUpdate(prevProps) {
    const { currentRoom } = this.props
    if (currentRoom.seat_size !== prevProps.currentRoom.seat_size) {
      this.setState({ seatSize: currentRoom.seat_size })
    }
  }

  onSeatSizeChange = (e) => {
    e.persist()
    this.setState({ seatSize: e.target.value })
    this.throttledSeatSizeChange(e)
  }

  handleAddNewClick = () => {
    const { dispatch } = this.props
    dispatch(newTable())
    dispatch(setTask('edit-table'))
    dispatch(setPointSelection('start'))
  }

  handleDeleteClick = () => {
    const { dispatch } = this.props
    dispatch(setTask('delete-table'))
  }

  handleRoomChangeClick = () => {
    const { dispatch } = this.props
    dispatch(setModal('change-room', true))
  }

  handleContinueSeatingClick = () => {
    const { dispatch, history, currentOffering } = this.props
    history.push(`/offering/${currentOffering.id}`)
    dispatch(setTask('offering-overview'))
    dispatch(setView('assign-seats'))
  }

  handleSaveRoomName = (name, type) => {
    const { dispatch, currentRoom } = this.props
    dispatch(requestRoomUpdate(currentRoom.id, type, name))
  }

  render() {
    const { seatSize } = this.state
    const { currentRoom, seatCount } = this.props

    return (
      <div className="action-bar action-bar-room-overview">

        <div className="descriptions">
          <div className="flex-container pull-top">
            <h6>Name</h6>
            <EditableText
              text={currentRoom.name ? currentRoom.name : 'Click to add'}
              save={name => this.handleSaveRoomName(name, 'name')}
              validator="unique-room-name"
            />
            <h6>Total Room Capacity</h6>
            <p>{seatCount}</p>
          </div>
        </div>

        <div className="controls">

          <div className="flex-container">
            <button type="button" className="big-button" onClick={this.handleAddNewClick}>
              <FontAwesomeIcon icon={['far', 'plus-circle']} />
              <p>Add<br />Section</p>
            </button>
          </div>

          <div className="flex-container">
            <button type="button" className="big-button" onClick={this.handleDeleteClick}>
              <FontAwesomeIcon icon={['far', 'minus-circle']} />
              <p>Remove<br />Section</p>
            </button>
          </div>

          <AbDivider />

          <div className="flex-container seat-size">
            <div className="seat-size-slider">
              <div className="smaller" />
              <input type="range" min="30" max="115" step="3" value={seatSize} onChange={this.onSeatSizeChange} />
              <div className="larger" />
            </div>
            <p><small>Seat Size</small></p>
          </div>

          <AbDivider />

          <div className="flex-container">
            <a href={`${helpers.rootUrl}print/seating-chart/room/${currentRoom.id}`} target="_blank" rel="noopener noreferrer">
              <button type="button" className="big-button">
                <FontAwesomeIcon icon={['far', 'print']} />
                <p>Print<br />Blank Chart</p>
              </button>
            </a>
          </div>

          <Route
            path="/room/:roomId/:offeringId"
            render={() => (
              <div className="flex-container">
                <button type="button" className="big-button" onClick={this.handleRoomChangeClick}>
                  <FontAwesomeIcon icon="map-marker-alt" />
                  <p>Change<br />Room</p>
                </button>
              </div>
            )}
          />

          <Route
            path="/room/:roomId/:offeringId"
            render={() => (
              <Fragment>
                <AbDivider />
                <div className="continue-seating">
                  <button type="button" className="btn-accent" onClick={this.handleContinueSeatingClick}>
                    Continue Seating&nbsp;
                    <FontAwesomeIcon icon={['far', 'long-arrow-right']} />
                  </button>
                  <p>Return to assigning seats when ready</p>
                </div>
              </Fragment>
            )}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ app, entities }, { match }) => {
  const currentOffering = entities.offerings[match.params.offeringId] || null
  const tablesIdArray = Object.keys(entities.tables).filter(id => (
    parseInt(entities.tables[id].room_id) === parseInt(app.currentRoom.id)
  ))
  let seatCount = 0
  tablesIdArray.forEach((id) => { seatCount += parseInt(entities.tables[id].seat_count) })

  return {
    currentRoom: app.currentRoom,
    currentOffering,
    rooms: entities.rooms,
    seatCount,
  }
}

export default withRouter(connect(mapStateToProps)(AbRoomOverview))
