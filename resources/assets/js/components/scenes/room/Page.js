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
    const { currentOffering } = this.props

    // we want to store in state the width of the page element in the browser
    this.measurePageInBrowser()

    if (currentOffering) {
      this.calcGridDimensions(currentOffering.paper_size)
    } else {
      this.calcGridDimensions('tabloid')
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentOffering } = this.props
    const prevOffering = prevProps.currentOffering

    // are any students seated at non-existing seats?
    if (currentOffering) {
      this.checkForBadSeats()
    }

    // Does paper size need to be updated?
    if (currentOffering) {
      if (currentOffering.paper_size === 'letter'
        && (!prevOffering || prevOffering.paper_size !== 'letter')
      ) {
        this.calcGridDimensions('letter')
      }
      if (currentOffering.paper_size === 'tabloid'
        && (!prevOffering || prevOffering.paper_size !== 'tabloid')
      ) {
        this.calcGridDimensions('tabloid')
      }
    }

    // keep state updated with inner-page-container's width
    const browserPageWidth = parseInt(window.getComputedStyle(this.pageContRef.current).width)
    if (prevState.browserPageWidth !== browserPageWidth) {
      this.setState({ browserPageWidth })
    }
  }

  calcGridDimensions = (paperSize) => {
    const { gridColumns, gridRows } = this.state
    let pxWidth
    let pxHeight

    switch (paperSize) {
      case 'letter':
        pxWidth = helpers.letterPxWidth
        pxHeight = helpers.letterPxHeight
        break
      case 'tabloid':
      default:
        pxWidth = helpers.tabloidPxWidth
        pxHeight = helpers.tabloidPxHeight
    }

    const gridColumnWidth = parseFloat(parseFloat(pxWidth / gridColumns).toFixed(3))
    const gridRowHeight = parseFloat(parseFloat(pxHeight / gridRows).toFixed(3))

    this.setState({
      realPageWidth: pxWidth,
      realPageHeight: pxHeight,
      gridRowHeight,
      gridColumnWidth,
    })
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
      currentOfferingId,
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
      'flip-perspective': currentOffering && currentOffering.flipped,
      'paper-tabloid': (currentOffering && (currentOffering.paper_size === 'tabloid' || currentOffering.paper_size === null)) || !currentOffering,
      'paper-letter': currentOffering && currentOffering.paper_size === 'letter',
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
                        currentOfferingId={currentOfferingId}
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
  const { currentRoom } = app
  const {
    tables,
    offerings,
    students,
    seats,
  } = entities
  // const { currentOffering, currentRoom } = app

  // Do we have a current offering ID from the URL?
  const currentOfferingId = params.offeringId ? params.offeringId : null

  // Get the current offering if we can
  const currentOffering = currentOfferingId ? offerings[currentOfferingId] : null

  // Get the current Room ID
  let currentRoomId = null
  if (params.roomId) {
    currentRoomId = params.roomId
  } else if (offerings[currentOfferingId]) {
    currentRoomId = offerings[currentOfferingId.room_id] === null
      ? null
      : String(offerings[currentOfferingId].room_id)
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
  // Needed for checking bad seats.
  let currentStudents = []
  if (currentOffering) {
    currentStudents = Object.keys(students)
      .filter(id => currentOffering.students.includes(parseInt(id)))
      .map(id => students[id])
      .sort((a, b) => (b.last_name.toUpperCase() < a.last_name.toUpperCase() ? 1 : -1))
  }

  return {
    currentRoomId,
    currentRoom,
    currentOffering,
    currentOfferingId,
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
