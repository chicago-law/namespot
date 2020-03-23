import React, {
  useState, useEffect, useLayoutEffect, useRef,
} from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import styled from '../../utils/styledComponents'
import Page from './Page'
import { AppState } from '../../store'
import { Offering } from '../../store/offerings/types'
import { Room } from '../../store/rooms/types'

/**
 * The PageContainer component holds the Page. It is "normal" sized, meaning
 * it's our last stop before we start scaling down, and it just takes up all
 * the area allowed by its place in the grid of PageWorkspace.
 */

const Container = styled('div')`
  min-width: 0;
  min-height: 0;
`

interface StoreProps {
  offering: Offering | null;
  room: Room | null;
}
interface RouteParams {
  offeringId?: string;
  roomId?: string;
}

const PageContainer = ({ offering }: StoreProps & RouteComponentProps<RouteParams>) => {
  const [dimensions, setDimensions] = useState({
    height: 0,
    width: 0,
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const paperSize = (offering && offering.paper_size) || 'tabloid'

  function getDimensions() {
    if (containerRef.current) {
      const styles = getComputedStyle(containerRef.current)
      setDimensions({
        height: styles.height ? parseInt(styles.height) : 0,
        width: styles.width ? parseInt(styles.width) : 0,
      })
    }
  }

  useEffect(() => {
    window.addEventListener('resize', getDimensions)
    return (() => window.removeEventListener('resize', getDimensions))
  }, [])

  useLayoutEffect(() => {
    getDimensions()
  }, [paperSize])

  return (
    <Container ref={containerRef} className="page-container">
      <Page
        containerHeight={dimensions.height}
        containerWidth={dimensions.width}
      />
    </Container>
  )
}

const mapState = ({ offerings, rooms }: AppState, { match }: RouteComponentProps<RouteParams>) => {
  const { offeringId, roomId } = match.params
  const offering = offeringId ? offerings[offeringId] : null
  let room = roomId ? rooms[roomId] : null
  if (!room && offering) room = offering.room_id ? rooms[offering.room_id] : null
  return {
    offering,
    room,
  }
}

export default connect(mapState)(PageContainer)
