import React, { Component } from 'react';
import { Route } from 'react-router';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Table from './containers/Table';
import Grid from './containers/Grid';
import Guides from './Guides';
import RoomHeader from './containers/RoomHeader';
import Loading from '../../global/Loading';

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.gridContRef = React.createRef();
    this.state = {
      // set yer blip dimensions here!
      gridRows:19,
      gridColumns: 39,
    }
  }

  measureGrid() {
    const gridCont = this.gridContRef.current;
    const gridCSS = window.getComputedStyle(gridCont);
    return gridCSS;
  }

  setDefaultTask() {
    const url = this.props.match.path.split('/');
    switch (url[1]) {
      case 'room':
        this.props.setTask('edit-room');
        break;
      case 'offering':
        this.props.setTask('offering-overview');
        break;
      default:
        this.props.setTask(null);
    }
  }

  componentDidMount() {
    // force an update now that we can measure CSS of elements
    // this.forceUpdate();

    // create the grid and load the measurements into local state
    const grid = this.measureGrid();
    this.setState({
      gridRowHeight: parseInt(grid.height) / this.state.gridRows,
      gridColumnWidth: parseInt(grid.width) / this.state.gridColumns,
    });

    // fetch the tables if the roomID is ready
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
  }

  render() {
    const outerRoomContainerClasses = classNames({
      'outer-room-container':true,
      'edit-room':this.props.task === 'edit-room',
      'edit-table':this.props.task === 'edit-table',
      'offering-overview':this.props.task === 'offering-overview',
      'choosing-a-point':this.props.pointSelection,
      'is-loading':this.props.loading.rooms || this.props.loading.tables || this.props.loading.offerings
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
      <div className={outerRoomContainerClasses}>

        <Loading />

        <Route path="/offering" component={RoomHeader} />

        <div className='inner-room-container' ref={this.gridContRef}>

          {/* Here be the tables! */}
          <svg className='tables-container' xmlns="http://www.w3.org/2000/svg">
            <g className="tables">
              { tables }
            </g>
          </svg>

          {/* Here be the blips! */}
          <Route path='/room' render={() =>
            <svg className = 'grid-container' xmlns = "http://www.w3.org/2000/svg" >
              <Grid
                currentRoomID={this.props.match.params.roomID}
                gridColumns={this.state.gridColumns}
                gridColumnWidth={this.state.gridColumnWidth}
                gridRows={this.state.gridRows}
                gridRowHeight={this.state.gridRowHeight}
              />
            </svg>
          } />

          {/* Here be the guide lines! */}
          <Route path='/room' render={() =>
            <svg className='guides-container' xmlns="http://www.w3.org/2000/svg">
              <Guides
                gridColumns={this.state.gridColumns}
                gridColumnWidth={this.state.gridColumnWidth}
                gridRows={this.state.gridRows}
                gridRowHeight={this.state.gridRowHeight}
              />
            </svg>
          } />

        </div> {/* end inner room container */}

        <div className="room-label">
          <h3>FRONT</h3>
        </div>

      </div> /* end outer Room Container */
    );
  }
}

Room.propTypes = {
  currentRoom: PropTypes.shape({
    id: PropTypes.isRequired,
    name: PropTypes.isRequired,
    seat_size: PropTypes.oneOfType([PropTypes.string,PropTypes.number])
  }).isRequired,
  currentOffering: PropTypes.object.isRequired,
  currentTables: PropTypes.array,
  fetchTables: PropTypes.func.isRequired,
  setTask: PropTypes.func.isRequired,
  pointSelection: PropTypes.any,
}