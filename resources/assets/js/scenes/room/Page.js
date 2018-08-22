import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import helpers from '../../bootstrap'
import Table from './containers/Table'
import Seat from './containers/Seat'
import Grid from './containers/Grid'
import Guides from './Guides'
import PageHeader from './containers/PageHeader'
import Loading from '../../global/Loading'

export default class Page extends Component {
  constructor(props) {
    super(props)
    this.pageContRef = React.createRef()
    this.state = {
      gridRows: 38,
      gridColumns: 78,
      realPageWidth: helpers.tabloidPxWidth,
      realPageHeight: helpers.tabloidPxHeight,
      browserPageWidth: '' // this is .page-inner-container's css width
    }
  }

  measurePageInBrowser() {
    // update state with the CSS values of the page as displayed by the browser
    const pageCSS = window.getComputedStyle(this.pageContRef.current)
    this.setState({
      browserPageWidth: parseInt(pageCSS.width)
    })
  }

  checkForBadSeats() {
    if (
      this.props.view !== 'seating-chart'
      && this.props.currentOffering.id !== null
      && this.props.currentRoom !== null
      && this.props.currentSeats.length > 0
      && Object.keys(this.props.loading).every(type => this.props.loading[type] === false)
    ) {
      // Giving things a couple seconds to settle...
      setTimeout(() => {
        this.props.currentStudents.forEach(student => {
          const assignedSeatId = student.seats[`offering_${this.props.currentOffering.id}`]
          if (assignedSeatId && this.props.currentSeats.every(seat => parseInt(seat.id) !== parseInt(assignedSeatId))) {
            console.log(`assigned seat: ${assignedSeatId} doesn't actually exist`)
            this.props.assignSeat(this.props.currentOffering.id, student.id, null)
          }
        })
      }, 2000)
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

  componentDidUpdate(prevProps, prevState) {
    // are any students seated at non-existing seats?
    this.checkForBadSeats()

    // keep state updated with inner-page-container's width
    const browserPageWidth = parseInt(window.getComputedStyle(this.pageContRef.current).width)
    if (prevState.browserPageWidth !== browserPageWidth) {
      this.setState({ browserPageWidth })
    }

    // If the paper size changed, we need to do a few things manually here:
    // Changing to letter...
    if (prevProps.currentOffering.paperSize !== 'letter' && this.props.currentOffering.paperSize === 'letter') {
      const gridColumnWidth = parseFloat(parseFloat(helpers.letterPxWidth / this.state.gridColumns).toFixed(3))
      const gridRowHeight = parseFloat(parseFloat(helpers.letterPxHeight / this.state.gridRows).toFixed(3))
      this.setState({
        realPageWidth: helpers.letterPxWidth,
        realPageHeight: helpers.letterPxHeight,
        gridRowHeight,
        gridColumnWidth
      })
    }
    // Changing to tabloid...
    if (prevProps.currentOffering.paperSize !== 'tabloid' && this.props.currentOffering.paperSize === 'tabloid') {
      const gridColumnWidth = parseFloat(parseFloat(helpers.tabloidPxWidth / this.state.gridColumns).toFixed(3))
      const gridRowHeight = parseFloat(parseFloat(helpers.tabloidPxHeight / this.state.gridRows).toFixed(3))
      this.setState({
        realPageWidth: helpers.tabloidPxWidth,
        realPageHeight: helpers.tabloidPxHeight,
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
        sX={parseInt(table.sX)} sY={parseInt(table.sY)} eX={parseInt(table.eX)} eY={parseInt(table.eY)} qX={parseInt(table.qX)} qY={parseInt(table.qY)}
        gridCoords={table.gridCoords}
        seatCount={parseInt(table.seat_count)}
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
      'flip-perspective': this.props.currentOffering.flipped,
      'paper-tabloid': this.props.currentOffering.paperSize === 'tabloid' || this.props.currentOffering.paperSize === null,
      'paper-letter': this.props.currentOffering.paperSize === 'letter',
    })

    const innerPageContainerClasses = classNames({
      'inner-page-container':true,
      'card':true,
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
              <canvas className='original-canvas' height={`${this.state.realPageHeight}`} width={`${this.state.realPageWidth}`}></canvas>
            )}/>

            <PageHeader shrinkRatio={this.state.browserPageWidth / this.state.realPageWidth} />

            <div className={seatsContainerClasses} style={{
              'transformOrigin':'top left',
              'transform':`translateX(4.5px) scale(${this.state.browserPageWidth / this.state.realPageWidth})`
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
              {tables.length ? <g className="tables">{tables}</g> : !tables.length && this.props.view === 'assign-seats' && Object.keys(this.props.loading).every(type => this.props.loading[type] === false) && !Object.keys(this.props.modals).some(name => this.props.modals[name] === true) ? <text className='no-tables' x="50%" y="50%" fontSize="50px">No tables in this room yet. Go ahead and add some!</text> : ''}
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
            }} >
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