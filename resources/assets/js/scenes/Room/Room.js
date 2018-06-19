import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Table from './containers/Table';
import Grid from './containers/Grid';
import Guides from './Guides';
import RoomHeader from './containers/RoomHeader';
import Loading from '../../global/Loading';
import RosterGallery from './containers/RosterGallery';

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.gridContRef = React.createRef();
    this.state = {
      gridRows:19, // set blip dimensions here
      gridColumns: 39,
    }
  }

  measureGrid() { // create the grid and load the measurements into local state
    const gridCont = this.gridContRef.current;
    const gridCSS = window.getComputedStyle(gridCont);
    return gridCSS;
  }

  setDefaultTask() {
    const url = this.props.match.path.split('/');
    switch (url[1]) {
      case 'room':
        this.props.setView('edit-room');
        this.props.setTask('edit-room');
        break;
      case 'offering':
        this.props.setView('assign-seats');
        this.props.setTask('offering-overview');
        break;
      default:
        this.props.setTask(null);
    }
  }

  handleContinueSeatingClick() {
    this.props.history.push(`/offering/${this.props.currentOffering.id}`);
    this.props.setTask('offering-overview');
    this.props.setView('assign-seats');
  }

  checkForBadSeats() {
    if (this.props.currentSeats.length) { // only do the check if currentSeats has been hydrated
      this.props.currentStudents.forEach(student => {
        const assigned_seat = student.seats[`offering_${this.props.currentOffering.id}`];
        if (assigned_seat && !this.props.currentSeats.includes(assigned_seat)) {
          console.log(`student seated at non-existing seat: ${assigned_seat}, setting to null`);
          this.props.assignSeat(this.props.currentOffering.id, student.id, null);
        }
      });
    }
  }


  componentDidMount() {
    const grid = this.measureGrid();
    this.setState({
      gridRowHeight: parseFloat((parseInt(grid.height) / this.state.gridRows).toFixed(2)),
      gridColumnWidth: parseFloat((parseInt(grid.width) / this.state.gridColumns).toFixed(2)),
    });

    // get the rooms data if we need it
    this.props.requestRooms();

    // fetch the tables if the roomID is ready. At this point it will be if
    // it's coming from the URL. If the URL has offeringID, then roomID won't
    // be ready yet.
    if (this.props.currentRoomID != null) {
      this.props.fetchTables(this.props.currentRoomID);
    }

    // try right away to add current room to store
    if (this.props.currentRoomID != null) {
      this.props.findAndSetCurrentRoom(this.props.currentRoomID);
    }

    // try right away to add current offering to store
    if (this.props.currentOfferingID != null) {
      this.props.findAndSetCurrentOffering(this.props.currentOfferingID);
    }

    // get the students in this offering
    if (this.props.currentOfferingID != null) {
      this.props.requestStudents(this.props.currentOfferingID);
    }

    // look at the URL and decide a default task based on that
    this.setDefaultTask();
  }

  componentDidUpdate(prevProps) {
    // get the tables when we have a real roomID or it changes
    if (this.props.currentRoomID != null && prevProps.currentRoomID != this.props.currentRoomID) {
      this.props.fetchTables(this.props.currentRoomID);
    }

    // set current room
    if (this.props.currentRoomID != null && this.props.currentRoomID != prevProps.currentRoom.id) {
      this.props.findAndSetCurrentRoom(this.props.currentRoomID);
    }

    // set current offering
    if (this.props.currentOfferingID != null && this.props.currentOfferingID != prevProps.currentOffering.id) {
      this.props.findAndSetCurrentOffering(this.props.currentOfferingID);
    }

    // are any students seated at non-existing seats?
    this.checkForBadSeats();

    // this is checking for a very specific situation: if the room ID just
    // changed, and the view is set to 'edit-room', that means we just created
    // a new room and copied everything over to it, and now we want to edit it
    if (prevProps.currentRoom.id != this.props.currentRoom.id && this.props.view === 'edit-room') {
      console.log('new custom room created, redirecting to edit it...');
      this.props.history.push(`/room/${this.props.currentRoom.id}/${this.props.currentOffering.id}`);
    }
  }

  render() {
    const outerPageContainerClasses = classNames({
      'outer-page-container':true,
      'edit-room-view': this.props.view === 'edit-room',
      'assign-seats-view': this.props.view === 'assign-seats',
      'edit-room':this.props.task === 'edit-room' || this.props.task === 'delete-table',
      'edit-table':this.props.task === 'edit-table',
      'offering-overview':this.props.task === 'offering-overview',
      'find-student':this.props.task === 'find-student',
      'student-details':this.props.task === 'student-details',
      'choosing-a-point':this.props.pointSelection,
      'is-loading':this.props.loading.rooms || this.props.loading.tables || this.props.loading.offerings || this.props.loading.students
    })

    const tables = this.props.currentTables.map(table =>
      <Table
        key={table.id}
        id={table.id}
        sX={table.sX} sY={table.sY} eX={table.eX} eY={table.eY} qX={table.qX} qY={table.qY}
        coords={table.coords}
        seatCount={table.seat_count}
        gridrowheight={this.state.gridRowHeight}
        gridcolumnwidth={this.state.gridColumnWidth}
      />
    );

    return (
      <div className="room-workspace">

        <div className='room-workspace-left'>
          <Route path="/offering" component={RoomHeader} />
        </div>

        <div className={outerPageContainerClasses}>
          <Loading />
          <div className='inner-page-container card' ref={this.gridContRef}>
            {/* Here be the tables! */}
            <svg className='tables-container' xmlns="http://www.w3.org/2000/svg">
              <g className="tables">{ tables }</g>
            </svg>
            {/* Here be the blips! */}
            <Route path='/room' render={() =>
              <svg className='grid-container' xmlns="http://www.w3.org/2000/svg">
                <Grid gridColumns={this.state.gridColumns} gridColumnWidth={this.state.gridColumnWidth} gridRows={this.state.gridRows} gridRowHeight={this.state.gridRowHeight} />
              </svg>
            } />
            {/* Here be the guide lines! */}
            <Route path='/room' render={() =>
              <svg className='guides-container' xmlns="http://www.w3.org/2000/svg">
                <Guides gridColumns={this.state.gridColumns} gridColumnWidth={this.state.gridColumnWidth} gridRows={this.state.gridRows} gridRowHeight={this.state.gridRowHeight} />
              </svg>
            } />
            {/* Here be the front of room label! */}
            <div className="front-label">
              <h3>FRONT</h3>
            </div>
          </div>
        </div>

        <div className='room-workspace-right'>
          <Route path="/offering" component={RosterGallery} />
          <Route path="/room/:roomID/:offeringID" render={() =>
            <div className='continue-seating' onClick={() => this.handleContinueSeatingClick()}>
              <button className='btn-accent'>Continue Seating <i className="far fa-long-arrow-right"></i></button>
              <p>Return to assigning seats when ready</p>
            </div>
          } />
        </div>

      </div>
    );
  }
}

Room.propTypes = {
  assignSeat: PropTypes.func.isRequired,
  currentOffering: PropTypes.object.isRequired,
  currentOfferingID: PropTypes.number,
  currentRoom: PropTypes.object.isRequired,
  currentRoomID: PropTypes.number,
  currentTables: PropTypes.array.isRequired,
  fetchTables: PropTypes.func.isRequired,
  findAndSetCurrentOffering: PropTypes.func.isRequired,
  findAndSetCurrentRoom: PropTypes.func.isRequired,
  pointSelection: PropTypes.string,
  requestRooms: PropTypes.func.isRequired,
  requestStudents: PropTypes.func.isRequired,
  setTask: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired,
  task: PropTypes.string,
  tempTable: PropTypes.object,
  view: PropTypes.string
}