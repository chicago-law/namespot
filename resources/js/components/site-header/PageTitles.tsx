import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { IconPrefix, IconName } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from '../../utils/styledComponents'
import EditOfferingTitles from './EditOfferingTitles'
import EditRoomTitles from './EditRoomTitles'

const Container = styled('div')`
  display: flex;
  align-items: center;
  .icon-container {
    margin: 0 1.5em;
    svg {
      position: relative;
      top: 2px;
      font-size: ${(props) => props.theme.ms(2)};
      color: ${(props) => props.theme.darkGray};
    }
  }
  h2, p {
    margin: 0;
  }
  p {
    font-size: ${(props) => props.theme.ms(-1)};
  }
`

const PageTitles = () => {
  function makeSimpleTitles(
    title: string,
    icon?: [IconPrefix, IconName],
  ) {
    return (
      <>
        {icon && (
          <div className="icon-container">
            <FontAwesomeIcon icon={icon} />
          </div>
        )}
        <h2>{title}</h2>
      </>
    )
  }

  return (
    <Container>
      <Switch>
        <Route
          exact
          path="/offerings"
          component={() => makeSimpleTitles('Classes', ['far', 'map'])}
        />
        <Route
          path="/offerings/:offeringId"
          component={EditOfferingTitles}
        />
        <Route
          exact
          path="/rooms"
          component={() => makeSimpleTitles('Rooms', ['far', 'map-marker-alt'])}
        />
        <Route
          path="/rooms/:roomId"
          component={EditRoomTitles}
        />
        <Route
          path="/students"
          component={() => makeSimpleTitles('Students', ['far', 'users'])}
        />
        <Route
          path="/import-export"
          component={() => makeSimpleTitles('Import / Export Data', ['far', 'upload'])}
        />
        <Route
          path="/settings"
          component={() => makeSimpleTitles('Settings', ['far', 'cog'])}
        />
      </Switch>
    </Container>
  )
}

export default PageTitles
