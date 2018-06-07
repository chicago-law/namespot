import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

class Table extends Component {
  constructor(props) {
    super(props);
    this.pathRef = React.createRef();
    this.tableGroupRef = React.createRef();
  }

  handleTableClick(e) {
    // check what to do with this table by looking at the task:
    if (this.props.task === 'delete-table') {
      this.props.removeTableRequest(this.props.id);
      this.props.setTask('edit-room');
    } else {

      // change theRoom status
      this.props.setTask('edit-table');
      this.props.setPointSelection('start');

      // send this table to tempTable
      this.props.selectTable(this.props.id, this.props.match.params.roomID, this.props.seatCount, this.props.coords);

      // change url to editing table url
      // this.props.history.push(`${this.props.match.url}/section/${this.props.id}`);
    }
  }

  componentDidMount() {
    this.forceUpdate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.coords !== this.props.coords) {
      this.forceUpdate();
    }
  }

  render() {

    // make the path string
    let d = '';
    if (this.props.qX !== null && this.props.qY !== null) { // test if there is a curve point set or not
      d = `M ${(this.props.sX * this.props.gridcolumnwidth).toFixed(2)} ${(this.props.sY * this.props.gridrowheight).toFixed(2)}
           Q ${(this.props.qX * this.props.gridcolumnwidth).toFixed(2)} ${(this.props.qY * this.props.gridrowheight).toFixed(2)}
           ${(this.props.eX * this.props.gridcolumnwidth).toFixed(2)} ${(this.props.eY * this.props.gridrowheight).toFixed(2)}`;
    } else {
      d = `M ${(this.props.sX * this.props.gridcolumnwidth).toFixed(2)} ${(this.props.sY * this.props.gridrowheight).toFixed(2)}
           L ${(this.props.eX * this.props.gridcolumnwidth).toFixed(2)} ${(this.props.eY * this.props.gridrowheight).toFixed(2)}`;
    }

    // make the seat cooridinate list
    let path = this.pathRef.current;
    let seatCoords = {};
    if (path && path.getTotalLength()) {
      const length = path.getTotalLength();
      let seatCount = this.props.seatCount;
      for (let i = 0; i < seatCount; i++) {
        const coords = i === 0 ? path.getPointAtLength(0) : path.getPointAtLength(length / (seatCount - 1) * i);
        const seatID = `${this.props.id}_${i}`;
        seatCoords[seatID] = {
          'x': coords.x.toFixed(2),
          'y': coords.y.toFixed(2)
        }
      }
    }

    // create array of seats from seat coordinate list
    let seats = [];
    if (seatCoords) {
      const seatSize = this.props.currentRoom.seat_size;
      seats = Object.keys(seatCoords).map(key =>
        <svg xmlns="http://www.w3.org/2000/svg" className='seat' key={key}>
          <rect
            id={key}
            x={seatCoords[key].x + 'px'} y={seatCoords[key].y + 'px'}
            width={seatSize} height={seatSize}
            rx="3" ry="3"
            transform={`translate(-${seatSize / 2} -${seatSize / 2})`}
          />
        </svg>
      );
    }

    // table classes
    const tableClass = classNames({
      'table':true,
      'is-active': this.props.id === this.props.tempTable.id ? true : false
    });

    return (
      <g ref={this.tableGroupRef} className={tableClass}>
        { seats }
        <path ref={this.pathRef} d={d} onClick={(e) => this.handleTableClick(e)} />
      </g>
    )
  }
}

export default Table;