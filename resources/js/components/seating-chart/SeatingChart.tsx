import React, { useEffect } from 'react'
import { Route, withRouter, RouteComponentProps } from 'react-router-dom'
import PageContainer from './PageContainer'
import styled from '../../utils/styledComponents'
import OfferingInfo from './OfferingRoster'
import useUnmountModalCloser from '../../hooks/useUnmountModalCloser'
import OfferingOptions from './OfferingOptions'
import RoomSidebarLeft from './RoomSidebarLeft'

/**
 * The Seating Chart component encompasses the page itself, as well as other
 * tool areas outside of the page, like sidebars (but not the action bar).
 * This lays it all out using CSS Grid and controls how they change on
 * smaller screen.
 */

const Container = styled('div')`
  display: grid;
  grid-template-columns: 15em auto 15em;
  padding: 0 1.5em;
  overflow: visible;
  >div {
    margin-top: 2em;
  }
  @media (max-width: ${(props) => props.theme.break.medium}) {
    grid-template-columns: 10em auto 10em;
    padding: 0 1em;
  }
`

interface OwnProps {
  isPrintingChart: boolean;
}
interface RouteParams {
  offeringId?: string;
  roomId?: string;
}

const SeatingChart = ({
  isPrintingChart,
  match,
}: OwnProps & RouteComponentProps<RouteParams>) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useUnmountModalCloser()

  return (
    <Container className="page-workspace">
      <Route
        path="/offerings/:offeringId"
        render={(props) => (
          <>
            <OfferingOptions {...props} />
            <PageContainer {...props} />
            <OfferingInfo {...props} />
          </>
        )}
      />

      <Route
        path="/rooms/:roomId/:offeringId?"
        render={(props) => (
          <>
            <RoomSidebarLeft />
            <PageContainer {...props} />
            <div />
          </>
        )}
      />
    </Container>
  )
}

export default withRouter(SeatingChart)
