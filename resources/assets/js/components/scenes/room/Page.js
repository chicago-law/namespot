import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter, Route } from 'react-router-dom'
import classNames from 'classnames/bind'
import helpers from '../../../bootstrap'
import Table from './Table'
import Seat from './Seat'
import Grid from './Grid'
import Guides from './Guides'
import PageHeader from './PageHeader'
import Loading from '../../Loading'
import RoomNotSet from './RoomNotSet'
import { assignSeat } from '../../../actions'

class Page extends Component {
  constructor(props) {
    super(props)
    this.pageContRef = React.createRef()
    this.state = {
      gridRows: 38,
      gridColumns: 78,
      realPageWidth: helpers.tabloidPxWidth,
      realPageHeight: helpers.tabloidPxHeight,
      browserPageWidth: '', // this is .page-inner-container's css width
    }
  }

  componentDidMount() {
    const { gridColumns, gridRows } = this.state
    const { currentOffering } = this.props

    // we want to store in state the width of the page element in the browser
    this.measurePageInBrowser()

    // set the dimensions of the grid rows and columns
    if (currentOffering.paper_size === 'letter') {
      const gridColumnWidth = parseFloat((helpers.letterPxWidth / gridColumns).toFixed(3))
      const gridRowHeight = parseFloat((helpers.letterPxHeight / gridRows).toFixed(3))
      this.setState({
        realPageWidth: helpers.letterPxWidth,
        realPageHeight: helpers.letterPxHeight,
        gridColumnWidth,
        gridRowHeight,
      })
    } else {
      const gridColumnWidth = parseFloat((helpers.tabloidPxWidth / gridColumns).toFixed(3))
      const gridRowHeight = parseFloat((helpers.tabloidPxHeight / gridRows).toFixed(3))
      this.setState({
        gridColumnWidth,
        gridRowHeight,
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { gridColumns, gridRows } = this.state
    const { currentOffering } = this.props

    // are any students seated at non-existing seats?
    this.checkForBadSeats()

    // keep state updated with inner-page-container's width
    const browserPageWidth = parseInt(window.getComputedStyle(this.pageContRef.current).width)
    if (prevState.browserPageWidth !== browserPageWidth) {
      this.setState({ browserPageWidth })
    }

    // If the paper size changed, we need to do a few things manually here:
    // Changing TO letter...
    if (prevProps.currentOffering.paper_size !== 'letter' && currentOffering.paper_size === 'letter') {
      const gridColumnWidth = parseFloat(parseFloat(helpers.letterPxWidth / gridColumns).toFixed(3))
      const gridRowHeight = parseFloat(parseFloat(helpers.letterPxHeight / gridRows).toFixed(3))
      this.setState({
        realPageWidth: helpers.letterPxWidth,
        realPageHeight: helpers.letterPxHeight,
        gridRowHeight,
        gridColumnWidth,
      })
    }
    // Changing TO tabloid...
    if (prevProps.currentOffering.paper_size !== 'tabloid' && currentOffering.paper_size === 'tabloid') {
      const gridColumnWidth = parseFloat((helpers.tabloidPxWidth / gridColumns).toFixed(3))
      const gridRowHeight = parseFloat((helpers.tabloidPxHeight / gridRows).toFixed(3))
      this.setState({
        realPageWidth: helpers.tabloidPxWidth,
        realPageHeight: helpers.tabloidPxHeight,
        gridRowHeight,
        gridColumnWidth,
      })
    }
  }

  measurePageInBrowser = () => {
    // update state with the CSS values of the page as displayed by the browser
    const pageCSS = window.getComputedStyle(this.pageContRef.current)
    this.setState({ browserPageWidth: parseInt(pageCSS.width) })
  }

  checkForBadSeats() {
    // If a seat doesn't exist, remove the student from it.
    // Only do this if a bunch of specific conditions are met - don't want to be
    // accidentally removing students from real seats!
    const {
      dispatch,
      currentOffering,
      currentRoom,
      currentSeats,
      currentStudents,
      currentTables,
      loading,
      view,
    } = this.props
    if (
      view !== 'seating-chart'
      && currentOffering.id !== null
      && currentRoom !== null
      && currentSeats.length > 0
      && currentTables.length > 0
      && Object.keys(loading).every(type => loading[type] === false)
    ) {
      currentStudents.forEach((student) => {
        const assignedSeatId = student.enrollment[`offering_${currentOffering.id}`].seat
        if (assignedSeatId && currentSeats.every(seat => (
          parseInt(seat.id) !== parseInt(assignedSeatId)))) {
          console.log(this.props) //eslint-disable-line
          console.log(`assigned seat: ${assignedSeatId} doesn't actually exist!`) //eslint-disable-line
          dispatch(assignSeat(currentOffering.id, student.id, null))
        }
      })
    }
  }

  render() {
    const {
      browserPageWidth,
      gridRowHeight,
      gridRows,
      gridColumnWidth,
      gridColumns,
      realPageHeight,
      realPageWidth,
    } = this.state
    const {
      currentOffering,
      currentSeats,
      currentTables,
      loading,
      modals,
      pointSelection,
      settings,
      task,
      view,
      withStudents,
    } = this.props

    const tables = currentTables.map(table => (
      <Table
        key={table.id}
        id={table.id}
        sX={parseInt(table.sX)}
        sY={parseInt(table.sY)}
        eX={parseInt(table.eX)}
        eY={parseInt(table.eY)}
        qX={parseInt(table.qX)}
        qY={parseInt(table.qY)}
        gridCoords={table.gridCoords}
        seatCount={parseInt(table.seat_count)}
        labelPosition={table.label_position}
        strokeWidth={currentOffering && currentOffering.paper_size === 'letter' ? 30 * 0.6 : 30}
        gridrowheight={gridRowHeight}
        gridcolumnwidth={gridColumnWidth}
      />
    ))

    const outerPageContainerClasses = classNames({
      'outer-page-container': true,
      'edit-room-view': view === 'edit-room',
      'assign-seats-view': view === 'assign-seats',
      'printing-view': view === 'seating-chart',
      'edit-room': task === 'edit-room' || task === 'delete-table',
      'edit-table': task === 'edit-table',
      'offering-overview': task === 'offering-overview',
      'find-student': task === 'find-student',
      'student-details': task === 'student-details',
      'choosing-a-point': pointSelection,
      'is-loading': loading.rooms || loading.tables || loading.offerings || loading.students,
      'flip-perspective': currentOffering.flipped,
      'paper-tabloid': currentOffering.paper_size === 'tabloid' || currentOffering.paper_size === null || currentOffering === null,
      'paper-letter': currentOffering.paper_size === 'letter',
    })

    const innerPageContainerClasses = classNames({
      'inner-page-container': true,
      card: true,
    })

    const seatsContainerClasses = classNames({
      'seats-container': true,
    })

    return (
      <div className={outerPageContainerClasses}>
        <Loading />
        <div className={innerPageContainerClasses} ref={this.pageContRef}>
          <div className="page">

            {/* If this is an offering, do we have a room set for it? */}
            {view === 'assign-seats' && currentOffering.room_id === null
              ? <RoomNotSet />
              : (
                <Fragment>
                  <Route
                    path="/print"
                    render={() => (
                      <canvas className="original-canvas" height={`${realPageHeight}`} width={`${realPageWidth}`} />
                    )}
                  />

                  <PageHeader
                    catalogPrefix={settings.catalog_prefix}
                    schoolName={settings.school_name}
                    shrinkRatio={browserPageWidth / realPageWidth}
                  />

                  <div
                    className={seatsContainerClasses}
                    style={{
                      transformOrigin: 'top left',
                      transform: `translateX(4.5px) scale(${browserPageWidth / realPageWidth})`,
                    }}
                  >
                    {currentSeats.map(seat => (
                      <Seat
                        key={seat.id}
                        id={seat.id}
                        className="seat"
                        left={seat.x}
                        top={seat.y}
                        labelPosition={seat.labelPosition}
                        withStudents={withStudents}
                      />
                    ))}
                  </div>

                  <svg
                    className="tables-container"
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${realPageWidth} ${realPageHeight}`}
                  >
                    {tables.length > 0 && (
                      <g className="tables">{tables}</g>
                    )}
                    {!tables.length
                      && view === 'assign-seats'
                      && Object.keys(loading).every(type => loading[type] === false)
                      && !Object.keys(modals).some(name => modals[name] === true)
                      && (
                        <text
                          className="no-tables"
                          x="50%"
                          y="50%"
                        >
                          No tables in this room yet. Go ahead and add some!
                        </text>
                      )}
                    }
                  </svg>

                  <Route
                    path="/room"
                    render={() => (
                      <svg
                        className="grid-container"
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        viewBox={`0 0 ${realPageWidth} ${realPageHeight}`}
                      >
                        <Grid
                          gridColumns={gridColumns}
                          gridColumnWidth={gridColumnWidth}
                          gridRows={gridRows}
                          gridRowHeight={gridRowHeight}
                          currentOffering={currentOffering}
                        />
                      </svg>
                    )}
                  />

                  <Route
                    path="/room"
                    render={() => (
                      <svg
                        className="guides-container"
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        viewBox={`0 0 ${realPageWidth} ${realPageHeight}`}
                      >
                        <Guides
                          gridColumns={gridColumns}
                          gridColumnWidth={gridColumnWidth}
                          gridRows={gridRows}
                          gridRowHeight={gridRowHeight}
                        />
                      </svg>
                    )}
                  />

                  <div
                    className="front-label"
                    style={{
                      transformOrigin: 'bottom center',
                      transform: `scale(${browserPageWidth / realPageWidth})`,
                    }}
                  >
                    <h3>FRONT</h3>
                  </div>

                </Fragment>
              )
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ app, entities, settings }, { match, withStudents = true }) => {
  const { params } = match
  const {
    tables,
    offerings,
    students,
    seats,
  } = entities
  const { currentOffering, currentRoom } = app

  // find current room ID either from URL or from currentOffering
  const currentOfferingID = params.offeringID ? params.offeringID : null
  let currentRoomID = null
  if (params.roomID) {
    currentRoomID = params.roomID
  } else if (offerings[currentOfferingID]) {
    currentRoomID = offerings[currentOfferingID.room_id] === null
      ? null
      : String(offerings[currentOfferingID.room_id])
  }

  // find all tables that belong to this room
  const currentTables = Object.keys(tables)
    .filter(id => parseFloat(tables[id].room_id) === parseFloat(currentRoom.id))
    .map(id => tables[id])

  // make an array of all the seats in the current room
  const currentSeats = []
  Object.keys(seats).forEach((seatId) => {
    if (seats[seatId].room_id === currentRoom.id) currentSeats.push(seats[seatId])
  })

  // make an array of all the students in the current offering
  const currentStudents = Object.keys(students)
    .filter(id => currentOffering.students.includes(parseInt(id)))
    .map(id => students[id])

  return {
    currentRoomID,
    currentRoom,
    currentOffering,
    currentOfferingID,
    currentSeats,
    currentStudents,
    currentTables,
    loading: app.loading,
    modals: app.modals,
    pointSelection: app.pointSelection,
    settings,
    task: app.task,
    tempTable: app.tempTable,
    view: app.view,
    withStudents,
  }
}

export default withRouter(connect(mapStateToProps)(Page))
