import React, { Component } from 'react';
import classNames from 'classnames/bind';
import Table from '../room/containers/Table';
// import jsPDF from 'jspdf';

// import { Page, Text, View, Document, Stylesheet } from 'react-pdf/core';
// import ReactPDF from 'react-pdf/node';

export default class SeatingChart extends Component {
  constructor(props) {
    super(props)
    this.pageContainerRef = React.createRef();
    this.state = {
      // set blip dimensions here. must be the same as blip dimensions in Room!!
      gridRows:19,
      gridColumns: 39,
    }
  }

  measureGrid() {
    const pageContainerCss = window.getComputedStyle(this.pageContainerRef.current);

    // note: we use bottom padding here for row height instead of actual height
    // cause of the CSS trick to keep aspect ratio of tabloid paper (bc of IE)
    const PCHeight = parseInt(pageContainerCss.paddingBottom);
    const PCWidth = parseInt(pageContainerCss.width);
    const gridRowHeight =  parseFloat((PCHeight / this.state.gridRows).toFixed(2));
    const gridColumnWidth = parseFloat((PCWidth / this.state.gridColumns).toFixed(2));

    this.setState({
      PCHeight, PCWidth, gridRowHeight, gridColumnWidth
    });
  }

  componentDidMount() {
    // fetch data
    this.props.fetchRoom(this.props.roomId);
    this.props.fetchTables(this.props.roomId);
    this.props.requestOffering(this.props.offeringId);
    this.props.requestStudents(this.props.offeringId);

    // create the grid and load the measurements into local state
    this.measureGrid();

    // set currentOffering and currentRoom in store, because Table relies on them
    // this.props.findAndSetCurrentOffering(this.props.offeringId);
    // this.props.findAndSetCurrentRoom(this.props.roomId);
  }

  componentDidUpdate() {
      // set currentOffering and currentRoom in store, because Table relies on them
      this.props.findAndSetCurrentOffering(this.props.offeringId);
      this.props.findAndSetCurrentRoom(this.props.roomId);
  }

  render() {

    const currentTablesIdArray = Object.keys(this.props.tables).filter(tableId => Object.keys(this.props.rooms).length && this.props.tables[tableId].room_id === this.props.rooms[this.props.roomId].id);

    const seatingChartClasses = classNames({
      'seating-chart':true,
      'with-students': this.props.match.params.offeringid ? true : false
    })

    return (
      <div className={seatingChartClasses}>

        <div className="outer-page-container">
          <div className="inner-page-container" ref={this.pageContainerRef}>
            <svg className='tables-container' xmlns='http://www.w3.org/2000/svg' viewBox={`0 0 ${this.state.PCWidth} ${this.state.PCHeight}`}>
              <g className="tables">
                {currentTablesIdArray.map(tableId => {
                  const table = this.props.tables[tableId];
                  return (
                    <Table
                      key={table.id}
                      id={table.id}
                      sX={table.sX} sY={table.sY} eX={table.eX} eY={table.eY} qX={table.qX} qY={table.qY}
                      coords={table.coords}
                      seatCount={table.seat_count}
                      gridrowheight={this.state.gridRowHeight}
                      gridcolumnwidth={this.state.gridColumnWidth}
                      seat_size={this.props.rooms[this.props.roomId].seat_size}
                    />
                  )
                })}
              </g>
            </svg>
            <div className="front-label">
              <h3>FRONT</h3>
            </div>
          </div>
        </div>




      </div>
    )
  }
}