import React, { Component } from 'react';
import classNames from 'classnames/bind';
import Table from './containers/Table';
import Grid from './containers/Grid';
import Guides from './Guides';

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.gridContRef = React.createRef();
    this.state = {
      // set blip dimensions here
      gridRows:19,
      gridColumns: 39,
    }
  }

  measureGrid() {
    const gridCont = this.gridContRef.current;
    const gridCSS = window.getComputedStyle(gridCont);
    return gridCSS;
  }

  componentDidMount() {
    // fire action to fectch Tables and load them into global store
    this.props.fetchTables(this.props.match.params.roomID);

    // force an update now that we can measure CSS of elements
    this.forceUpdate();

    // create the grid and load the measurements into local state
    const grid = this.measureGrid();
    this.setState({
      gridRowHeight: parseInt(grid.height) / this.state.gridRows,
      gridColumnWidth: parseInt(grid.width) / this.state.gridColumns,
    });
  }

  render() {
    const outerRoomContainerClass = classNames({
      'outer-room-container':true,
      'edit-table':this.props.task === 'edit-table',
      'choosing-a-point':this.props.pointSelection
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
      <div className={outerRoomContainerClass}>
        <div className='inner-room-container' ref={this.gridContRef}>

          {/* Here be the tables! */}
          <svg className='tables-container' xmlns="http://www.w3.org/2000/svg">
            <g className="tables">
              { tables }
            </g>
          </svg>

          {/* Here be the blip grid! */}
          <svg className='grid-container' xmlns="http://www.w3.org/2000/svg">
            <Grid
              currentRoomID={this.props.match.params.roomID}
              gridColumns={this.state.gridColumns}
              gridColumnWidth={this.state.gridColumnWidth}
              gridRows={this.state.gridRows}
              gridRowHeight={this.state.gridRowHeight}
            />
          </svg>

          {/* Here be the guide lines! */}
          <svg className='guides-container' xmlns="http://www.w3.org/2000/svg">
            <Guides
              gridColumns={this.state.gridColumns}
              gridColumnWidth={this.state.gridColumnWidth}
              gridRows={this.state.gridRows}
              gridRowHeight={this.state.gridRowHeight}
            />
          </svg>

        </div> {/* end inner room container */}

        <div className="room-label">
          <h3>FRONT</h3>
        </div>

      </div> /* end outer Room Container */
    );
  }
}