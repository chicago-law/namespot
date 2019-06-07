/* eslint-disable eqeqeq */
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Page from './Page'
import PagePref from './PagePref'
import OfferingDetails from './OfferingDetails'
import WorkspaceMessage from './WorkspaceMessage'
import Loading from '../../Loading'

class Workspace extends Component {
  pageContRef = React.createRef()

  componentDidMount() {
    const {
      currentRoomId,
      currentOfferingId, // from the URL!
      requestRoom,
      findAndSetCurrentRoom,
      requestStudents,
      requestOffering,
    } = this.props

    // do these if you have the currentRoomId
    if (currentRoomId != null) {
      requestRoom(currentRoomId)
      findAndSetCurrentRoom(currentRoomId)
    }

    // If we have an offeringId from the URL, we'll grab the the data we need:
    // the offering itself, and also the students for this offering.
    if (currentOfferingId) {
      requestOffering(currentOfferingId)
      requestStudents(currentOfferingId)
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
      currentRoomId,
      currentRoom,
      findAndSetCurrentRoom,
      requestRoom,
      fetchTables,
    } = this.props
    // fetch the room if need be
    if (currentRoomId != null && prevProps.currentRoomId === null) {
      requestRoom(currentRoomId)
    }

    // Set current room if any IDs change
    // Note: these triggers do not catch changes to Room entities. So if you
    // update one, a la setCurrentSeatSize, it wont automatically also update
    // in app / currentRoom. You must call findAndSetCurrentRoom at that point.
    // Same with findAndSetCurrentOffering.
    if (
      currentRoomId != null
      && (
        currentRoomId != prevProps.currentRoomId
        || currentRoom.id != prevProps.currentRoom.id
        || currentRoomId != currentRoom.id
      )
    ) {
      findAndSetCurrentRoom(currentRoomId)
    }

    // get the tables when currentRoom is ready and it has changed
    if (currentRoom.id != null && prevProps.currentRoom.id != currentRoom.id) {
      fetchTables(currentRoom.id)
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
    const { loading, currentOfferingId } = this.props

    // if there's an offering ID in the URL,
    // we know we need to wait for offerings no matter what.
    if (currentOfferingId
      && (loading.offerings || !('offerings' in loading)
    )) {
      return (
        <div style={{ marginTop: '10em' }}>
          <Loading />
        </div>
      )
    }

    if (loading.students || loading.rooms) {
      return (
        <div style={{ marginTop: '10em' }}>
          <Loading />
        </div>
      )
    }

    return (
      <div className="room-workspace">

        <div className="room-workspace-left">
          <Route path="/offering/:offeringId" component={PagePref} />
        </div>

        <Page />

        <div className="room-workspace-right">
          <Route path="/room/:roomId" component={WorkspaceMessage} />
          <Route path="/offering/:offeringId" component={OfferingDetails} />
        </div>

      </div>
    )
  }
}


export default Workspace
