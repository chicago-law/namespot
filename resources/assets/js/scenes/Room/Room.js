import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import Page from './containers/Page'
import RoomDetails from './containers/RoomDetails'
import RosterGallery from './containers/RosterGallery'

export default class Room extends Component {
  constructor(props) {
    super(props)
    this.pageContRef = React.createRef()
  }

  setDefaultTask() {
    const url = this.props.match.path.split('/')
    switch (url[1]) {
      case 'room':
        this.props.setView('edit-room')
        this.props.setTask('edit-room')
        break
      case 'offering':
        this.props.setView('assign-seats')
        this.props.setTask('offering-overview')
        break
      default:
        this.props.setTask(null)
    }
  }

  componentDidMount() {
    // do these if you have the currentRoomID
    if (this.props.currentRoomID != null) {
      this.props.requestRoom(this.props.currentRoomID)
      this.props.findAndSetCurrentRoom(this.props.currentRoomID)
    }

    // do these if you have the currentOfferingID
    if (this.props.currentOfferingID != null) {
      this.props.findAndSetCurrentOffering(this.props.currentOfferingID)
      this.props.requestStudents(this.props.currentOfferingID)
      this.props.requestOffering(this.props.currentOfferingID)
    }

    // look at the URL and decide a default task based on that
    this.setDefaultTask()
  }

  componentDidUpdate(prevProps) {
    // fetch the room if need be
    if (this.props.currentRoomID != null && prevProps.currentRoomID === null) {
      this.props.requestRoom(this.props.currentRoomID)
    }

    // Set current room if any IDs change
    // Note: these triggers do not catch changes to Room entities. So if you
    // update one, a la setCurrentSeatSize, it wont automatically also update
    // in app / currentRoom. You must call findAndSetCurrentRoom at that point.
    // Same with findAndSetCurrentOffering.
    if (
      this.props.currentRoomID != null &&
      (
        this.props.currentRoomID != prevProps.currentRoomID ||
        this.props.currentRoom.id != prevProps.currentRoom.id ||
        this.props.currentRoomID != this.props.currentRoom.id
      )
    ){
      this.props.findAndSetCurrentRoom(this.props.currentRoomID)
    }

    // set current offering if any IDs change
    if (
      this.props.currentOfferingID != null &&
      (
        this.props.currentOfferingID != prevProps.currentOfferingID ||
        this.props.currentOffering.id != prevProps.currentOffering.id ||
        this.props.currentOfferingID != this.props.currentOffering.id
      )
    ){
      this.props.findAndSetCurrentOffering(this.props.currentOfferingID)
    }

    // get the tables when currentRoom is ready and it has changed
    if (this.props.currentRoom.id != null && prevProps.currentRoom.id != this.props.currentRoom.id) {
      this.props.fetchTables(this.props.currentRoom.id)
    }

    // If the offering has a null value for its room_id, and we're not waiting
    // on any data, then we can safely decide it just doesn't have a room
    // assigned to it yet, so we should ask!
    if (this.props.currentRoomID === null && Object.keys(this.props.loading).every(type => this.props.loading[type] === false) && !this.props.modals['assign-room']) {
      this.props.setModal('assign-room',true)
    }

    // this is checking for a very specific situation: if the room ID just
    // changed, and the view is set to 'edit-room', that means we just created
    // a new room and copied everything over to it, and now we want to edit it
    if (prevProps.currentRoom.id != this.props.currentRoom.id && this.props.view === 'edit-room' && this.props.currentOffering.id != null) {
      console.log('new custom room created, redirecting to edit it...')
      this.props.history.push(`/room/${this.props.currentRoom.id}/${this.props.currentOffering.id}`)
    }
  }

  componentWillUnmount() {
    this.props.resetCurrentOffering()
    this.props.resetCurrentRoom()
    this.props.setCurrentStudentId(null)
    this.props.setCurrentSeatId(null)
    this.props.setView('')
    this.props.setTask('')
    this.props.clearModals()
  }

  render() {

    return (
      <div className="room-workspace">

        <div className='room-workspace-left'>
          <Route path="/offering" component={RoomDetails} />
        </div>

        <Page />

        <div className='room-workspace-right'>
          <Route path="/offering" component={RosterGallery} />
        </div>

      </div>
    )
  }

}

Room.propTypes = {
  assignSeat: PropTypes.func.isRequired,
  currentOffering: PropTypes.object.isRequired,
  currentOfferingID: PropTypes.string,
  currentRoom: PropTypes.object.isRequired,
  currentRoomID: PropTypes.string,
  currentSeatIds: PropTypes.array,
  currentTables: PropTypes.array.isRequired,
  fetchTables: PropTypes.func.isRequired,
  findAndSetCurrentOffering: PropTypes.func.isRequired,
  findAndSetCurrentRoom: PropTypes.func.isRequired,
  pointSelection: PropTypes.string,
  resetCurrentOffering: PropTypes.func.isRequired,
  resetCurrentRoom: PropTypes.func.isRequired,
  requestRooms: PropTypes.func.isRequired,
  requestOffering: PropTypes.func.isRequired,
  requestStudents: PropTypes.func.isRequired,
  setCurrentStudentId: PropTypes.func.isRequired,
  setCurrentSeatId: PropTypes.func.isRequired,
  setTask: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired,
  task: PropTypes.string,
  tempTable: PropTypes.object,
  view: PropTypes.string
}