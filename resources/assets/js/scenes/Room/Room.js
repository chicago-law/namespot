import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Table from './containers/Table';
import Grid from './containers/Grid';
import Guides from './Guides';
import RoomDetails from './containers/RoomDetails';
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

  checkForBadSeats() {
    // only do the check if everything we need is all downloaded
    if (Object.keys(this.props.loading).every(type => this.props.loading[type] === false)) {
      this.props.currentStudents.forEach(student => {
        const assigned_seat = student.seats[`offering_${this.props.currentOffering.id}`];
        if (assigned_seat && !this.props.currentSeats.includes(assigned_seat)) {
          this.props.assignSeat(this.props.currentOffering.id, student.id, null);
        }
      });
    }

  }

  componentDidMount() {
    const grid = this.measureGrid();
    // note: we use bottom padding here for row height instead of actual height
    // cause of the CSS trick to keep aspect ratio of tabloid paper (bc of IE)
    const gridRowHeight = parseFloat((parseInt(grid.paddingBottom) / this.state.gridRows).toFixed(2));
    const gridColumnWidth = parseFloat((parseInt(grid.width) / this.state.gridColumns).toFixed(2));
    this.setState({
      gridRowHeight, gridColumnWidth
    });

    // do these if you have the currentRoomID
    if (this.props.currentRoomID != null) {
      this.props.requestRoom(this.props.currentRoomID);
      this.props.findAndSetCurrentRoom(this.props.currentRoomID);
    }

    // do these if you have the currentOfferingID
    if (this.props.currentOfferingID != null) {
      this.props.findAndSetCurrentOffering(this.props.currentOfferingID);
      this.props.requestStudents(this.props.currentOfferingID);
      this.props.requestOffering(this.props.currentOfferingID);
    }

    // look at the URL and decide a default task based on that
    this.setDefaultTask();
  }

  componentDidUpdate(prevProps) {
    // fetch the room if need be
    if (this.props.currentRoomID != null && prevProps.currentRoomID === null) {
      this.props.requestRoom(this.props.currentRoomID);
    }

    // whenever Room updates, we should update store's currentRoom and currentOffering
    // to do: maybe make this a little more selective...?
    this.props.findAndSetCurrentOffering(this.props.currentOfferingID);
    this.props.findAndSetCurrentRoom(this.props.currentRoomID);

    // set current room
    // if (this.props.currentRoomID != null && (this.props.currentRoomID != prevProps.currentRoomID || this.props.currentRoomID != this.props.currentRoom.id)) {
      // this.props.findAndSetCurrentRoom(this.props.currentRoomID);
    // }

    // set current offering
    // if (this.props.currentOfferingID != null && (this.props.currentOfferingID != prevProps.currentOfferingID || this.props.currentOfferingID != this.props.currentOffering.id)) {
      // this.props.findAndSetCurrentOffering(this.props.currentOfferingID);
    // }

    // get the tables when currentRoom is ready and it has changed
    if (this.props.currentRoom.id != null && prevProps.currentRoom.id != this.props.currentRoom.id) {
      this.props.fetchTables(this.props.currentRoom.id);
    }

    // are any students seated at non-existing seats?
    this.checkForBadSeats();

    // If the offering has a null value for its room_id, and we're not waiting
    // on any data, then we can safely decide it just doesn't have a room
    // assigned to it yet, so we should ask!
    if (this.props.currentRoomID === null && Object.keys(this.props.loading).every(type => this.props.loading[type] === false) && !this.props.modals['assign-room']) {
      this.props.setModal('assign-room',true);
    }

    // this is checking for a very specific situation: if the room ID just
    // changed, and the view is set to 'edit-room', that means we just created
    // a new room and copied everything over to it, and now we want to edit it
    if (prevProps.currentRoom.id != this.props.currentRoom.id && this.props.view === 'edit-room' && this.props.currentOffering.id != null) {
      console.log('new custom room created, redirecting to edit it...');
      this.props.history.push(`/room/${this.props.currentRoom.id}/${this.props.currentOffering.id}`);
    }
  }

  componentWillUnmount() {
    this.props.resetCurrentOffering();
    this.props.resetCurrentRoom();
    this.props.setCurrentStudentId(null);
    this.props.setCurrentSeatId(null);
    this.props.setView('');
    this.props.setTask('');
    this.props.clearModals();
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
          <Route path="/offering" component={RoomDetails} />
        </div>

        <div className={outerPageContainerClasses}>
          <Loading />
          <div id='page' className='inner-page-container card' ref={this.gridContRef}>
            {/* Here be the tables! */}
            <svg className='tables-container' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100% 100%">
              {tables.length ? <g className="tables">{tables}</g> : !tables.length && this.props.view === 'assign-seats' && Object.keys(this.props.loading).every(type => this.props.loading[type] === false) && !Object.keys(this.props.modals).some(name => this.props.modals[name] === true) ? <text className='no-tables' x="50%" y="50%">No tables in this room yet. Go ahead and add some!</text> : ''}
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
        </div>

      </div>
    );
  }
}

Room.propTypes = {
  assignSeat: PropTypes.func.isRequired,
  currentOffering: PropTypes.object.isRequired,
  currentOfferingID: PropTypes.string,
  currentRoom: PropTypes.object.isRequired,
  currentRoomID: PropTypes.string,
  currentTables: PropTypes.array.isRequired,
  fetchTables: PropTypes.func.isRequired,
  findAndSetCurrentOffering: PropTypes.func.isRequired,
  findAndSetCurrentRoom: PropTypes.func.isRequired,
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
  view: PropTypes.string
}