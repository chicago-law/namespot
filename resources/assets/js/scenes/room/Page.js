import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import Table from './containers/Table'
import Seat from './containers/Seat'
import Grid from './containers/Grid'
import Guides from './Guides'
import ChartDetails from './containers/ChartDetails'
import Loading from '../../global/Loading'

export default class Page extends Component {
  constructor(props) {
    super(props)
    this.pageContRef = React.createRef()
    this.state = {
      gridRows: 38,
      gridColumns: 78,
      realPageWidth: 1550, // this is the width of a tabloid piece of paper, in px
      realPageHeight: 1000, // this is the height of a tabloid piece of paper, in px
      browserPageWidth: '' // this is .page-inner-container's css width
    }
  }

  measurePageInBrowser() {
    // update state with the CSS values of the page as displayed by the browser
    const pageCont = this.pageContRef.current
    const pageCSS = window.getComputedStyle(pageCont)
    this.setState({
      browserPageWidth: parseInt(pageCSS.width)
    })
  }

  checkForBadSeats() {
    if (
      this.props.currentOffering.id !== null
      && this.props.currentRoom !== null
      && this.props.currentSeats.length > 0
      && Object.keys(this.props.loading).every(type => this.props.loading[type] === false) // only do the check if app is not waiting on any data
    ) {
      this.props.currentStudents.forEach(student => {
        const assignedSeatId = student.seats[`offering_${this.props.currentOffering.id}`]
        if (assignedSeatId && this.props.currentSeats.every(seat => seat.id != assignedSeatId)) {
          console.log(`assigned seat: ${assignedSeatId} doesn't actually exist`)
          this.props.assignSeat(this.props.currentOffering.id, student.id, null)
        }
      })
    }
  }

  componentDidMount() {
    // we want to store in state the width of the page element in the browser
    this.measurePageInBrowser()

    // set the dimensions of the grid rows and columns
    const gridRowHeight = parseFloat(parseFloat(this.state.realPageHeight / this.state.gridRows).toFixed(3))
    const gridColumnWidth = parseFloat(parseFloat(this.state.realPageWidth / this.state.gridColumns).toFixed(3))
    this.setState({
      gridRowHeight, gridColumnWidth
    })
  }

  componentDidUpdate(prevProps) {
    // are any students seated at non-existing seats?
    this.checkForBadSeats()

    // If the paper size changed, we need to do a few things manually here.
    // Changing to letter...
    if (prevProps.currentOffering.paperSize !== 'letter' && this.props.currentOffering.paperSize === 'letter') {
      const gridRowHeight = parseFloat(parseFloat(816 / this.state.gridRows).toFixed(3))
      const gridColumnWidth = parseFloat(parseFloat(1056 / this.state.gridColumns).toFixed(3))
      this.setState({
        realPageWidth: 1056, // this is the width of a letter piece of paper, in px
        realPageHeight: 816, // this is the height of a letter piece of paper, in px
        gridRowHeight,
        gridColumnWidth
      })
    }
    // Changing to tabloid...
    if (prevProps.currentOffering.paperSize !== 'tabloid' && this.props.currentOffering.paperSize === 'tabloid') {
      const gridRowHeight = parseFloat(parseFloat(1000 / this.state.gridRows).toFixed(3))
      const gridColumnWidth = parseFloat(parseFloat(1550 / this.state.gridColumns).toFixed(3))
      this.setState({
        realPageWidth: 1550, // this is the width of a tabloid piece of paper, in px
        realPageHeight: 1000, // this is the height of a tabloid piece of paper, in px
        gridRowHeight,
        gridColumnWidth
      })
    }
  }

  render() {

    const tables = this.props.currentTables.map(table =>
      <Table
        key={table.id}
        id={table.id}
        sX={table.sX} sY={table.sY} eX={table.eX} eY={table.eY} qX={table.qX} qY={table.qY}
        gridCoords={table.gridCoords}
        seatCount={table.seat_count}
        labelPosition={table.label_position}
        gridrowheight={this.state.gridRowHeight}
        gridcolumnwidth={this.state.gridColumnWidth}
      />
    )

    const outerPageContainerClasses = classNames({
      'outer-page-container':true,
      'edit-room-view': this.props.view === 'edit-room',
      'assign-seats-view': this.props.view === 'assign-seats',
      'printing-view': this.props.view === 'seating-chart',
      'edit-room':this.props.task === 'edit-room' || this.props.task === 'delete-table',
      'edit-table':this.props.task === 'edit-table',
      'offering-overview':this.props.task === 'offering-overview',
      'find-student':this.props.task === 'find-student',
      'student-details':this.props.task === 'student-details',
      'choosing-a-point':this.props.pointSelection,
      'is-loading':this.props.loading.rooms || this.props.loading.tables || this.props.loading.offerings || this.props.loading.students,
      'flip-perspective': this.props.currentOffering.flipped
    })

    const innerPageContainerClasses = classNames({
      'inner-page-container':true,
      'card':true,
      'tabloid': this.props.currentOffering.paperSize === 'tabloid' || this.props.currentOffering.paperSize === null,
      'letter': this.props.currentOffering.paperSize === 'letter',
    })

    const seatsContainerClasses = classNames({
      'seats-container':true,
    })

    return (
      <div className={outerPageContainerClasses}>
        <Loading />

        <div className={innerPageContainerClasses} ref={this.pageContRef}>

          <div className="page">

            <Route path='/print' render={() => (
              <canvas height="100%" width="100%"></canvas>
            )} />

            <ChartDetails shrinkRatio={this.state.browserPageWidth / this.state.realPageWidth}/>

            <div className={seatsContainerClasses} style={{
              'transformOrigin':'top left',
              'transform':`scale(${this.state.browserPageWidth / this.state.realPageWidth})`
            }}>
              { this.props.currentSeats.map(seat =>
                <Seat
                  key={seat.id}
                  id={seat.id}
                  className='seat'
                  left={seat.x}
                  top={seat.y}
                  labelPosition={seat.labelPosition}
                  withStudents={this.props.withStudents}
                />
              )}
            </div>

            <svg className='tables-container' xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox={`0 0 ${this.state.realPageWidth} ${this.state.realPageHeight}`}>
              {tables.length ? <g className="tables">{tables}</g> : !tables.length && this.props.view === 'assign-seats' && Object.keys(this.props.loading).every(type => this.props.loading[type] === false) && !Object.keys(this.props.modals).some(name => this.props.modals[name] === true) ? <text className='no-tables' x="50%" y="50%">No tables in this room yet. Go ahead and add some!</text> : ''}
            </svg>

            <Route path='/room' render={() =>
              <svg className='grid-container' xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox={`0 0 ${this.state.realPageWidth} ${this.state.realPageHeight}`}>
                <Grid gridColumns={this.state.gridColumns} gridColumnWidth={this.state.gridColumnWidth} gridRows={this.state.gridRows} gridRowHeight={this.state.gridRowHeight} />
              </svg>
            } />

            <Route path='/room' render={() =>
              <svg className='guides-container' xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox={`0 0 ${this.state.realPageWidth} ${this.state.realPageHeight}`}>
                <Guides gridColumns={this.state.gridColumns} gridColumnWidth={this.state.gridColumnWidth} gridRows={this.state.gridRows} gridRowHeight={this.state.gridRowHeight} />
              </svg>
            } />

            <div className="front-label" style={{
              'transformOrigin':'bottom center',
              'transform':`scale(${this.state.browserPageWidth / this.state.realPageWidth})`
            }}>
              <h3>FRONT</h3>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

Page.propTypes = {
  assignSeat: PropTypes.func.isRequired,
  currentOffering: PropTypes.object.isRequired,
  currentOfferingID: PropTypes.string,
  currentRoom: PropTypes.object.isRequired,
  currentRoomID: PropTypes.string,
  currentSeats: PropTypes.array,
  currentStudents: PropTypes.array.isRequired,
  currentTables: PropTypes.array.isRequired,
  fetchTables: PropTypes.func.isRequired,
  findAndSetCurrentOffering: PropTypes.func.isRequired,
  findAndSetCurrentRoom: PropTypes.func.isRequired,
  loading: PropTypes.object.isRequired,
  modals: PropTypes.object.isRequired,
  pointSelection: PropTypes.string,
  resetCurrentOffering: PropTypes.func.isRequired,
  resetCurrentRoom: PropTypes.func.isRequired,
  requestRooms: PropTypes.func.isRequired,
  requestOffering: PropTypes.func.isRequired,
  requestStudents: PropTypes.func.isRequired,
  setCurrentStudentId: PropTypes.func.isRequired,
  setCurrentSeatId: PropTypes.func.isRequired,
  setTask: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired,
  task: PropTypes.string,
  tempTable: PropTypes.object,
  view: PropTypes.string,
  withStudents: PropTypes.bool.isRequired
}