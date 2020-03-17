import React, { useRef, useLayoutEffect, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled from '../../utils/styledComponents'
import TablesContainer from './TablesContainer'
import SeatsContainer from './SeatsContainer'
import BlipGrid from './BlipGrid'
import { AppState } from '../../store'
import { SessionState } from '../../store/session/types'
import { getTablesForRoom } from '../../store/tables/actions'
import { TablesState } from '../../store/tables/types'
import { LoadingState } from '../../store/loading/types'
import { Offering } from '../../store/offerings/types'
import { PrintingState } from '../../store/printing/types'
import GuideLines from './GuideLines'

/**
 * The Room component is where we show the actual room layout. A grid is put
 * down on top of the room. The dimensions of that grid are specified in gridDimensions.
 *
 * Room ID is passed down manually because it could be based on the URL or based
 * on the offering from the URL. So, extra logic is required to do that,
 * so we do it up in Page, which needs it also, and then pass it down to here.
 *
 * Tables are fetched and gated here.
 */

const Container = styled('div')<{ flipped: boolean }>`
  position: relative;
  transition: transform 300ms ease-out;
  &.loading {
    opacity: 0.5;
  }
  ${(props) => props.flipped && `
    transform: rotate(180deg);
  `}
`

interface StoreProps {
  offering: Offering | null;
  loading: LoadingState;
  session: SessionState;
  tables: TablesState;
  printing: PrintingState;
  getTablesForRoom: typeof getTablesForRoom;
}
interface OwnProps {
  roomId: string;
  offeringId: string | undefined;
}

const Room = ({
  offering,
  loading,
  session,
  tables,
  printing,
  getTablesForRoom,
  roomId,
}: StoreProps & OwnProps) => {
  const roomRef = useRef<HTMLDivElement>(null)
  const { task } = session
  const paperSize = (offering && offering.paper_size) || 'tabloid'

  const [roomPxDimensions, setDimensions] = useState({
    height: 0,
    width: 0,
  })

  useEffect(() => {
    if (!session.roomTablesReceived.includes(roomId)) {
      getTablesForRoom(roomId)
    }
  }, [])

  useLayoutEffect(() => {
    if (roomRef.current) {
      const styles = window.getComputedStyle(roomRef.current)
      setDimensions({
        height: styles.height ? parseInt(styles.height) : 0,
        width: styles.width ? parseInt(styles.width) : 0,
      })
    }
  }, [paperSize])

  return (
    <Container
      ref={roomRef}
      className={loading.tables || !tables[roomId] ? 'room loading' : 'room'}
      flipped={!!(offering && offering.flipped)}
    >
      {!printing.isPrinting && (
        <TablesContainer roomId={roomId} roomPxDimensions={roomPxDimensions} />
      )}
      <SeatsContainer roomId={roomId} />
      {(task === 'choose-point' || task === 'edit-table') && (
        <>
          <GuideLines roomPxDimensions={roomPxDimensions} />
          <BlipGrid roomId={roomId} roomPxDimensions={roomPxDimensions} />
        </>
      )}
    </Container>
  )
}

const mapState = ({
  offerings,
  loading,
  session,
  tables,
  printing,
}: AppState, {
  offeringId,
}: OwnProps) => ({
  offering: offeringId ? offerings[offeringId] : null,
  loading,
  session,
  tables,
  printing,
})

export default connect(mapState, {
  getTablesForRoom,
})(Room)
