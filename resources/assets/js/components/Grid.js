import React, { Component } from 'react';
import classNames from 'classnames/bind';
import Table from './Table';

export default class Grid extends Component {
  constructor(props) {
    super(props);
    this.gridContRef = React.createRef();
    this.state = {
      gridRows:20,
      gridColumns: 40
    }
  }

  measureGrid() {
    const gridCont = this.gridContRef.current;
    const gridCSS = window.getComputedStyle(gridCont);
    this.setState({
      gridRowHeight: parseInt(gridCSS.height) / this.state.gridRows,
      gridColumnWidth: parseInt(gridCSS.width) / this.state.gridColumns,
    });
  }

  handleBlipClick(e) {
    if (this.props.newTable.choosing) { // only proceed if we're choosing a blip
      const pointType = this.props.newTable.choosing;
      const key = e.target.getAttribute('id');
      this.props.selectPoints(key, pointType)
    }
  }

  makeBlipGrid() {
    let blips = [];
    for (let i = 0; i < this.state.gridColumns; i++) {
      for (let j = 0; j < this.state.gridRows; j++) {
        blips.push(this.drawBlip(i, j));
      }
    }
    return blips;
  }

  drawBlip(x, y) {
    const key = x + '_' + y;
    const blipClasses = classNames({
      blip:true,
      active:isActiveTest(key, this.props.newTable)
    });
    function isActiveTest(key, newTable) { // is this blip's key the same as the one selected for the current 'choosing' type?
      if (newTable.coords) {
        for (let coordType in newTable.coords) {
          if (newTable.coords.hasOwnProperty(coordType)) {
            if (newTable.coords[coordType] == key) {
              return true;
            }
          }
        }
      }
    }
    const blip = <circle
      key={key}
      id={key}
      className={blipClasses}
      onClick={(e) => this.handleBlipClick(e)}
      cx={(x * this.state.gridColumnWidth).toFixed(2) + 'px'}
      cy={(y * this.state.gridRowHeight).toFixed(2) + 'px'}
      r='7'
      x={x}
      y={y}
    />
    return blip;
  }

  componentDidMount() {
    this.measureGrid();
  }

  render() {
    const tables = this.props.tables.map(table =>
      <Table
        key={table.id}
        coords={table.coords}
        gridrowheight={this.state.gridRowHeight}
        gridcolumnwidth={this.state.gridColumnWidth}
      />
    );
    const blips = this.makeBlipGrid();
    return (
      <div className='inner-grid-container' ref={this.gridContRef}>
        <svg id='room' xmlns="http://www.w3.org/2000/svg">
          { tables }
          { blips }
        </svg>
      </div>
    );
  }
}