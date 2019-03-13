import React from 'react'
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import queryString from 'query-string'
import helpers from '../../../bootstrap'
import InstructorNames from '../../InstructorNames'

const PageHeader = ({
  shrinkRatio,
  currentRoom,
  currentOffering,
  withStudents,
  catalogPrefix,
  schoolName,
}) => {
  const catalog_prefix = catalogPrefix // converting back to snake case for consistency
  const school_name = schoolName

  const roomChartDetails = () => (
    <div className="page-header">
      <div
        className="left"
        style={{
        transformOrigin: 'top left',
        transform: `scale(${shrinkRatio})`,
      }}
      >
        <h3>{school_name && school_name}</h3>
      </div>
      <div
        className="right"
        style={{
        transformOrigin: 'top right',
        transform: `scale(${shrinkRatio})`,
      }}
      >
        <h3>{currentRoom.name}</h3>
      </div>
    </div>
  )

  const offeringChartDetails = () => (
    <div className="page-header">
      <div
        className="left"
        style={{
        transform: `scale(${shrinkRatio})`,
      }}
      >
        <h3>
          {currentRoom.name}
          {currentOffering.term_code && ` - ${helpers.termCodeToString(currentOffering.term_code)}`}
          {school_name && ` - ${school_name}`}
          <Route
            path="/print"
            render={() => (
              currentOffering && withStudents && (
                <span>Printed {new Date().toLocaleDateString()}</span>
              )
            )}
          />
        </h3>
      </div>
      <div
        className="right"
        style={{
        transform: `scale(${shrinkRatio})`,
      }}
      >
        <h3>
          {currentOffering.long_title}
          &nbsp;- {catalog_prefix || 'LAWS'}&nbsp;
          {currentOffering.catalog_nbr}&nbsp;
          {currentOffering.section && ` - ${currentOffering.section} `}
          {currentOffering.instructors.length > 0 && (
            <span> - <InstructorNames offering={currentOffering} /></span>
          )}
        </h3>
      </div>
    </div>
  )

  return (
    <div className="page-header-container">
      <Route path="/room" component={roomChartDetails} />
      <Route path="/offering" component={offeringChartDetails} />
      <Route exact path="/print/seating-chart/room/:roomid" component={roomChartDetails} />
      <Route exact path="/print/seating-chart/room/:roomid/offering/:offeringid" component={offeringChartDetails} />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  // parse any URL parameters
  const urlParams = queryString.parse(ownProps.location.search)
  const withStudents = urlParams.withstudents !== 'false'

  return {
    currentOffering: state.app.currentOffering,
    currentRoom: state.app.currentRoom,
    withStudents,
  }
}

export default withRouter(connect(mapStateToProps)(PageHeader))
