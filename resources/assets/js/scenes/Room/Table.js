import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

class Table extends Component {
  constructor(props) {
    super(props);
    this.pathRef = React.createRef();
    this.tableGroupRef = React.createRef();
  }

  handleTableClick(e) {
    if (this.props.task === 'delete-table') {
      this.props.removeTableRequest(this.props.id);
      this.props.setTask('edit-room');
    }
    if (this.props.task === 'edit-room') {
      this.props.setTask('edit-table');
      this.props.setPointSelection('start');

      // send this table to tempTable
      this.props.selectTable(this.props.id, this.props.match.params.roomID, this.props.seatCount, this.props.coords);
    }
    e.stopPropagation();
  }

  handleSeatClick(e) {
    const occupied = e.target.closest('.seat').classList.contains('is-occupied');
    if (occupied) {
      switch (this.props.task) {
        case 'offering-overview':
        case 'find-student':
          this.props.setTask('student-details');
          this.props.setCurrentStudent(e.target.closest('[data-studentid]').dataset.studentid);
          break;
        case 'student-details':
          this.props.setCurrentStudent(e.target.closest('[data-studentid]').dataset.studentid);
          break;
      }
    }
    else { // seat is not occupied
      switch (this.props.task) {
        case 'offering-overview':
          this.props.setTask('find-student');
          this.props.setCurrentSeat(e.target.closest('[data-seatid]').dataset.seatid);
          break;
        case 'find-student':
          this.props.setCurrentSeat(e.target.closest('[data-seatid]').dataset.seatid);
          break;
        case 'student-details':
          this.props.setTask('find-student');
          this.props.setCurrentSeat(e.target.closest('[data-seatid]').dataset.seatid);
          break;
      }
    }
    e.stopPropagation();
  }

  findOccupant(seat_id) {
    let occupant = null;
    this.props.currentStudents.forEach(student => {
      const assigned_seat = student.seats['offering_' + this.props.currentOffering.id];
      if (assigned_seat === seat_id) {
        occupant = student;
      }
    });
    return occupant;
  }

  componentDidMount() {
    this.forceUpdate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.coords !== this.props.coords) {
      this.forceUpdate();
    }
    if (prevProps.currentStudents.length !== this.props.currentStudents.length) {
      this.forceUpdate();
    }
  }

  render() {
    const rootUrl = document.querySelector('body').dataset.root;

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

    // create array of seat JSX from seat coordinate list
    let seats = [];
    if (seatCoords) {
      const seatSize = this.props.currentRoom.seat_size;
      seats = Object.keys(seatCoords).map(key => {

        // for every seat, look for an occupant
        const occupant = this.findOccupant(key);

        // we'll show this if it's empty
        const emptySeat = (
          <g>
            <rect width="40" height="40"></rect>
            <g className="plus-person" transform="translate(9, 9)">
              <path d="M15,12 C17.21,12 19,10.21 19,8 C19,5.79 17.21,4 15,4 C12.79,4 11,5.79 11,8 C11,10.21 12.79,12 15,12 Z M6,10 L6,7 L4,7 L4,10 L1,10 L1,12 L4,12 L4,15 L6,15 L6,12 L9,12 L9,10 L6,10 Z M15,14 C12.33,14 7,15.34 7,18 L7,20 L23,20 L23,18 C23,15.34 17.67,14 15,14 Z"></path>
            </g>
          </g>
        );

        // and we'll show this if it has an occupant
        const occupiedSeat = occupant ? (
          <g data-studentid={occupant.id}>
            <filter id={`picture_${occupant.id}`} x="0%" y="0%" width='100%' height="100%">
              <feImage xlinkHref={`${rootUrl}images/faces/${occupant.picture}.jpg`} preserveAspectRatio="xMidYMid slice" />
            </filter>
            <rect filter={`url(#picture_${occupant.id})`} width='40' height='40'/>
          </g>
        ) : '';

        // seat classes
        const seatClasses = classNames({
          'seat': true,
          'is-selected': key === this.props.currentSeatId && this.props.task === 'find-student' ? true : false,
          'is-occupied': occupant ? true : false
        });

        return (
          <svg xmlns="http://www.w3.org/2000/svg"
            key={key} data-seatid={key}
            className={seatClasses}
            onClick={(e) => this.handleSeatClick(e)}
            x={seatCoords[key].x + 'px'} y={seatCoords[key].y + 'px'}
            width={seatSize} height={seatSize}
            viewBox="0 0 40 40"
          >
            { occupant ? occupiedSeat : emptySeat }
          </svg>
        )
      })
    }

    const tableClasses = classNames({
      'table':true,
      'is-active': this.props.id === this.props.tempTable.id ? true : false
    });

    return (
      <g className={tableClasses} ref={this.tableGroupRef} onClick={(e) => this.handleTableClick(e)} >
        <path className='table-path' ref={this.pathRef} d={d} />
        { seats }
      </g>
    )
  }
}

export default Table;

Table.propTypes = {
  coords: PropTypes.any.isRequired,
  currentOffering: PropTypes.object.isRequired,
  currentRoom: PropTypes.object.isRequired,
  currentSeatId: PropTypes.string,
  currentStudentId: PropTypes.number,
  currentStudents: PropTypes.array.isRequired,
  eX: PropTypes.number.isRequired,
  gridcolumnwidth: PropTypes.number,
  gridrowheight: PropTypes.number,
  id: PropTypes.number.isRequired,
  seatCount: PropTypes.number,
  removeTableRequest: PropTypes.func.isRequired,
  selectTable: PropTypes.func.isRequired,
  setPointSelection: PropTypes.func.isRequired,
  setTask: PropTypes.func.isRequired,
  task: PropTypes.string.isRequired,
}