import React, { useEffect } from 'react'
import { connect } from 'react-redux'
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
  getOfferingById: typeof getOfferingById;
  getStudentsForOffering: typeof getStudentsForOffering;
  getEnrollments: typeof getEnrollments;
  getRoomById: typeof getRoomById;
  getTablesForRoom: typeof getTablesForRoom;
  getAllRooms: typeof getAllRooms;
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
  getOfferingById,
  getStudentsForOffering,
  getEnrollments,
  getRoomById,
  getTablesForRoom,
  getAllRooms,
  match,
}: Props) => {
  const [, addRecentOffering] = useRecentOfferings()
  const { roomId = null, offeringId = null } = match.params
  const offering = (offeringId && offerings[offeringId]) || null

  // There aren't a lot of rooms, so we're just going to grab them all now.
  // This simplifies things elsewhere.
  useEffect(() => {
    if (!session.roomTemplatesReceived) {
      getAllRooms()
    }
  }, [])

  // If we have a room ID, fetch the room and its tables if we need them.
  useEffect(() => {
    if (roomId && !session.roomTablesReceived.includes(roomId)) {
      getTablesForRoom(roomId)
    }
  }, [])

  // If we have an offering ID, fetch the offering if we need it. When it's
  // loaded, we'll be able to then fetch its student, room, and table data.
  useEffect(() => {
    // The offering itself.
    if (offeringId && !offerings[offeringId]) {
      getOfferingById(offeringId)
    }
    // The things the offering needs.
    if (offering) {
      // The Room.
      if (offering.room_id && !rooms[offering.room_id]) {
        getRoomById(offering.room_id)
      }
      // The students and the enrollments.
      if (offering && !enrollments[offering.id]) {
        getStudentsForOffering(offering.id)
        getEnrollments(offering.id)
      }
    }
  }, [offering])

  // If we have an offering, store it in our Recent Offerings in local store.
  useEffect(() => {
    if (offering) {
      addRecentOffering(offering)
    }
  }, [])

  // Depending on what we're waiting to load, show loading until
  // it's ready...
  if (roomId) {
    if (!('rooms' in loading)
      || loading.rooms
      || !rooms[roomId]
      || !tables[roomId]
    ) {
      return tallLoading
    }
  }

  if (offeringId) {
    // Wait for the offering itself to load...
    if (loading.offerings || !('offerings' in loading) || !offerings[offeringId]) {
      return tallLoading
    }
    // Now the things we need once offering is here...
    const offeringRoomId = offerings[offeringId].room_id
    if (offeringRoomId) {
      if (!('rooms' in loading) || loading.rooms || !rooms[offeringRoomId]) {
        return tallLoading
      }
    }
    if (!('students' in loading) || loading.students
      || !('enrollments' in loading) || loading.enrollments || !(offeringId in enrollments)
    ) {
      return tallLoading
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

export default connect(mapState, {
  getOfferingById,
  getStudentsForOffering,
  getEnrollments,
  getRoomById,
  getTablesForRoom,
  getAllRooms,
})(Editor)
