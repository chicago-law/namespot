/* eslint-disable eqeqeq */
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Page from './Page'
import PagePref from './PagePref'
import OfferingDetails from './OfferingDetails'
import WorkspaceMessage from './WorkspaceMessage'

class Workspace extends Component {
  pageContRef = React.createRef()

  componentDidMount() {
    const {
      currentRoomID,
      currentOfferingID,
      requestRoom,
      findAndSetCurrentRoom,
      findAndSetCurrentOffering,
      requestStudents,
      requestOffering,
    } = this.props
    // do these if you have the currentRoomID
    if (currentRoomID != null) {
      requestRoom(currentRoomID)
      findAndSetCurrentRoom(currentRoomID)
    }

    // do these if you have the currentOfferingID
    if (currentOfferingID != null) {
      findAndSetCurrentOffering(currentOfferingID)
      requestStudents(currentOfferingID)
      requestOffering(currentOfferingID)
    }

    // look at the URL and decide a default task based on that
    this.setDefaultTask()

    // Manually scroll to the top of the page. If you had to scroll down on
    // OfferingList, you'll start scrolled down here too.
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  }

  componentDidUpdate(prevProps) {
    const {
      currentRoomID,
      currentRoom,
      findAndSetCurrentRoom,
      currentOffering,
      currentOfferingID,
      findAndSetCurrentOffering,
      requestRoom,
      fetchTables,
      history,
      view,
    } = this.props
    // fetch the room if need be
    if (currentRoomID != null && prevProps.currentRoomID === null) {
      requestRoom(currentRoomID)
    }

    // Set current room if any IDs change
    // Note: these triggers do not catch changes to Room entities. So if you
    // update one, a la setCurrentSeatSize, it wont automatically also update
    // in app / currentRoom. You must call findAndSetCurrentRoom at that point.
    // Same with findAndSetCurrentOffering.
    if (
      currentRoomID != null
      && (
        currentRoomID != prevProps.currentRoomID
        || currentRoom.id != prevProps.currentRoom.id
        || currentRoomID != currentRoom.id
      )
    ) {
      findAndSetCurrentRoom(currentRoomID)
    }

    // set current offering if any IDs change
    if (
      currentOfferingID != null
      && (
        currentOfferingID != prevProps.currentOfferingID
        || currentOffering.id != prevProps.currentOffering.id
        || currentOfferingID != currentOffering.id
      )
    ) {
      findAndSetCurrentOffering(currentOfferingID)
    }

    // get the tables when currentRoom is ready and it has changed
    if (currentRoom.id != null && prevProps.currentRoom.id != currentRoom.id) {
      fetchTables(currentRoom.id)
    }

    // this is checking for a very specific situation: if the room ID just
    // changed, and the view is set to 'edit-room', that means we just created
    // a new room and copied everything over to it, and now we want to edit it
    if (prevProps.currentRoom.id != currentRoom.id && view === 'edit-room' && currentOffering.id != null) {
      console.log('new custom room created, redirecting to edit it...') // eslint-disable-line
      history.push(`/room/${currentRoom.id}/${currentOffering.id}`)
    }
  }

  componentWillUnmount() {
    const {
      resetCurrentOffering,
      resetCurrentRoom,
      setCurrentStudentId,
      setCurrentSeatId,
      setView,
      setTask,
      clearModals,
      setPointSelection,
    } = this.props
    resetCurrentOffering()
    resetCurrentRoom()
    setCurrentStudentId(null)
    setCurrentSeatId(null)
    setView('')
    setTask('')
    clearModals()
    setPointSelection(null)
  }

  setDefaultTask() {
    const { match, setView, setTask } = this.props
    const url = match.path.split('/')
    switch (url[1]) {
      case 'room':
        setView('edit-room')
        setTask('edit-room')
        break
      case 'offering':
        setView('assign-seats')
        setTask('offering-overview')
        break
      default:
        setTask(null)
    }
  }

  render() {
    return (
      <div className="room-workspace">

        <div className="room-workspace-left">
          <Route path="/offering" component={PagePref} />
        </div>

        <Page />

        <div className="room-workspace-right">
          <Route path="/room" component={WorkspaceMessage} />
          <Route path="/offering" component={OfferingDetails} />
        </div>

      </div>
    )
  }
}


export default Workspace
