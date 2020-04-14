import React, { useState, useEffect, useRef } from 'react'
import { connect, useDispatch } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import styled from '../../utils/styledComponents'
import { AppState } from '../../store'
import { OfferingsState, Offering } from '../../store/offerings/types'
import PageHeader from './PageHeader'
import PageFooter from './PageFooter'
import Room from './Room'
import { PrintingState } from '../../store/printing/types'
import C from '../../utils/constants'
import assembleSeatingChart from '../../utils/assembleSeatingChart'
import { exitPrint } from '../../store/printing/actions'

/**
 * In the Page component, we're showing a div that is the actual dimensions of
 * the piece of paper the seating chart will print on, at least in so far as
 * CSS is able to do that, using inches for its height and width.
 *
 * But we also get the width of its containing div up a level in PageContainer.
 * That's sized by the CSS grid in PageWorkspace. So we compare these two values
 * and decide how much we need to shrink down Page and all its contents to size
 * it into PageContainer.
 */

interface ContainerProps {
  height: number;
  width: number;
  isPrintingChart: boolean;
}
const Container = styled('div')<ContainerProps>`
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: ${props => props.height}in;
  width: ${props => props.width}in;
  margin: 0 auto;
  padding: 2em 3em;
  transform-origin: top left;
  background: white;
  box-shadow: 0 1px 5px rgba(0,0,0, 0.1);
  border: 1px solid ${props => props.theme.offWhite};
  /* Apparently html2Canvas doesn't like it if the element is not in the top
  left corner. */
  ${props => props.isPrintingChart && `
    position: absolute;
    top: 0;
    left: 0;
  `}
`

interface OwnProps {
  containerHeight: number;
  containerWidth: number;
}
interface StoreProps {
  offerings: OfferingsState;
  printing: PrintingState;
}
interface RouteParams {
  offeringId?: string;
  roomId?: string;
}
type Props = OwnProps & StoreProps & RouteComponentProps<RouteParams>

const Page = ({
  offerings,
  printing,
  match,
  containerWidth,
}: Props) => {
  const dispatch = useDispatch()
  const pageRef = useRef<HTMLDivElement>(null)
  const { params } = match

  // If we have an offering ID in the URL, then up in Editor we will have
  // fetched the offering.
  let offering: Offering | null = null
  if (params.offeringId) offering = offerings[params.offeringId]

  // Figure out the room ID. Maybe we get it from the URL, maybe we get it
  // from the offering.
  let roomId: string | null = null
  if (params.roomId) roomId = params.roomId // eslint-disable-line
  if (offering && offering.room_id) roomId = offering.room_id

  // Page dimensions should default to tabloid, but we'll try switch that to
  // letter if we have an offering that's set to 'letter'.
  const paperDimensions = {
    height: C.tabloidHeight,
    width: C.tabloidWidth,
  }
  if (offering && offering.paper_size && offering.paper_size === 'letter') {
    paperDimensions.height = C.letterHeight
    paperDimensions.width = C.letterWidth
  }

  // Compare the width coming in of PageContainer to the width of our ideal
  // size here of the actual paper and determine how much we need to scale
  // everything down to fit.
  const [shrinkRatio, setShrinkRatio] = useState(0)

  useEffect(() => {
    // 1/96 is the conversion between inches and pixels that CSS uses.
    let shrinkRatio = parseFloat((containerWidth / (paperDimensions.width / (1 / 96))).toFixed(4))
    // Shouldn't ever make it bigger.
    if (shrinkRatio > 1) shrinkRatio = 1
    // If we're printing, we want the original unshrunk size instead of scaling down.
    if (printing.isPrinting && printing.format === 'seating-chart') shrinkRatio = 1
    setShrinkRatio(shrinkRatio)
  }, [containerWidth, printing, paperDimensions])

  useEffect(() => {
    if (printing.isPrinting && printing.format === 'seating-chart') {
      // Give it a second to finish dispatching before assembling.
      setTimeout(() => {
        if (pageRef.current) {
          assembleSeatingChart(
            pageRef.current,
            offering || undefined,
            () => dispatch(exitPrint()),
          )
        }
      }, 500)
    }
  }, [dispatch, offering, printing.format, printing.isPrinting])

  return (
    <Container
      className="page"
      ref={pageRef}
      height={paperDimensions.height}
      width={paperDimensions.width}
      style={{ transform: `scale(${shrinkRatio})` }}
      isPrintingChart={printing.isPrinting && printing.format === 'seating-chart'}
    >
      {roomId && (
        <>
          <PageHeader offeringId={(offering && offering.id) || undefined} roomId={roomId} />
          <Room roomId={roomId} offeringId={(offering && offering.id) || undefined} />
          <PageFooter printing={printing} flipped={!!(offering && offering.flipped)} />
        </>
      )}
      {!roomId && (
        <h1>No Room Assigned</h1>
      )}
    </Container>
  )
}

const mapState = ({ offerings, printing }: AppState) => ({
  offerings,
  printing,
})

export default withRouter(connect(mapState)(Page))
