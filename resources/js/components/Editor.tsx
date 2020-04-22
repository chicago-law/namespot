import React, { useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { getOfferingById } from '../store/offerings/actions'
import { AppState } from '../store/index'
import { OfferingsState } from '../store/offerings/types'
import ActionBar from './action-bar'
import SeatingChart from './seating-chart'
import { RoomsState } from '../store/rooms/types'
import { getRoomById, getAllRooms } from '../store/rooms/actions'
import { getTablesForRoom } from '../store/tables/actions'
import { SessionState } from '../store/session/types'
import { LoadingState } from '../store/loading/types'
import { TablesState } from '../store/tables/types'
import { getStudentsForOffering } from '../store/students/actions'
import { EnrollmentsState } from '../store/enrollments/types'
import { getEnrollments } from '../store/enrollments/actions'
import { PrintingState } from '../store/printing/types'
import Loading from './Loading'
import NameTents from './NameTents'
import FlashCards from './FlashCards'
import Roster from './Roster'
import useRecentOfferings from '../hooks/useRecentOfferings'

/**
 * The Editor component serves as the highest level wrapper for the functionality
 * of actually creating and editing rooms and seating charts. We'll load up the
 * necessary data here and block further rendering until they're done being fetched:
 * - offering (get ID from URL param)
 * - room (get ID from URL param or with Offering ID)
 * - tables (with Room ID)
 * - students (with Offering ID)
 * - enrollments (with Offering ID)
 *
 * So you can count on those things being ready anywhere downstream from here.
 * Note though that seats are generated from the tables coming in, and that happens
 * async, so you can NOT count on those being ready.
 */

const tallLoading = <Loading height={30} />

interface StoreProps {
  offerings: OfferingsState;
  enrollments: EnrollmentsState;
  rooms: RoomsState;
  tables: TablesState;
  session: SessionState;
  printing: PrintingState;
  loading: LoadingState;
}
interface UrlParams {
  offeringId?: string;
  roomId?: string;
}
type Props = StoreProps & RouteComponentProps<UrlParams>

const Editor = ({
  offerings,
  enrollments,
  rooms,
  tables,
  session,
  printing,
  loading,
  match,
}: Props) => {
  const dispatch = useDispatch()
  const [, addRecentOffering] = useRecentOfferings()
  const { roomId = null, offeringId = null } = match.params
  const offering = (offeringId && offerings[offeringId]) || null
  const {
    roomTemplatesReceived,
    roomTablesReceived,
    offeringStudentsReceived,
  } = session

  // There aren't a lot of rooms, so we're just going to grab them all now.
  // This simplifies things elsewhere. Note that this just gets the template rooms.
  useEffect(() => {
    if (!roomTemplatesReceived) dispatch(getAllRooms())
  }, [dispatch, roomTemplatesReceived])

  // If we have a room ID, fetch its tables.
  useEffect(() => {
    if (roomId && !roomTablesReceived.includes(roomId) && !loading.tables) {
      dispatch(getTablesForRoom(roomId))
    }
  }, [dispatch, loading, roomId, roomTablesReceived])

  // If we have an offering ID, fetch the offering if we need it.
  useEffect(() => {
    if (offeringId && !offerings[offeringId] && !loading.offerings) {
      dispatch(getOfferingById(offeringId))
    }
  }, [dispatch, loading, offeringId, offerings])

  // The things the offering needs.
  useEffect(() => {
    if (offering) {
      // The room (necessary if this offering has a custom room)
      if (offering.room_id && !rooms[offering.room_id] && !loading.rooms) {
        dispatch(getRoomById(offering.room_id))
      }
      // The tables.
      if (offering.room_id && !roomTablesReceived.includes(offering.room_id) && !loading.tables) {
        dispatch(getTablesForRoom(offering.room_id))
      }
      // The students.
      if (!offeringStudentsReceived.includes(offering.id) && !loading.students) {
        dispatch(getStudentsForOffering(offering.id))
      }
      // The enrollments.
      if (!enrollments[offering.id] && !loading.enrollments) {
        dispatch(getEnrollments(offering.id))
      }
    }
  }, [dispatch, enrollments, loading.enrollments, loading.rooms, loading.students, loading.tables, offering, offeringStudentsReceived, roomTablesReceived, rooms])

  // If we have an offering, store it in our Recent Offerings in local store.
  useEffect(() => {
    if (offering) addRecentOffering(offering)
  }, [addRecentOffering, offering])

  /* Depending on what we're waiting to load, show loading until it's ready... */

  // Only a room, not an offering.
  if (roomId) {
    if (loading.rooms || !rooms[roomId] || !tables[roomId]) {
      return tallLoading
    }
  }

  // An offering
  if (offeringId) {
    // Wait for the offering itself to load...
    if (loading.offerings || !offerings[offeringId]) {
      return tallLoading
    }
    // Now the things we need once offering is here:
    // First, the students...
    if (loading.students || loading.enrollments || !(offeringId in enrollments)) {
      return tallLoading
    }
    // Second, the room stuff if it has a room...
    const offeringRoomId = offerings[offeringId].room_id
    if (offeringRoomId) {
      if (loading.rooms || !rooms[offeringRoomId]) {
        return tallLoading
      }
    }
  }

  return (
    <>
      <ActionBar />
      <SeatingChart isPrintingChart={printing.isPrinting && printing.format === 'seating-chart'} />

      {printing.isPrinting && printing.format === 'flash-cards' && offeringId && (
        <FlashCards offeringId={offeringId} />
      )}
      {printing.isPrinting && printing.format === 'name-tents' && offeringId && (
        <NameTents offeringId={offeringId} />
      )}
      {printing.isPrinting && printing.format === 'roster' && offeringId && (
        <Roster offeringId={offeringId} />
      )}
    </>
  )
}

const mapState = ({
  offerings,
  enrollments,
  rooms,
  tables,
  session,
  printing,
  loading,
}: AppState) => ({
  offerings,
  enrollments,
  rooms,
  tables,
  session,
  printing,
  loading,
})

export default connect(mapState)(Editor)
