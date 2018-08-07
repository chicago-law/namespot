import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import { Route } from 'react-router-dom'
import { rootUrl } from '../../actions'

class Table extends Component {
  constructor(props) {
    super(props)
    this.pathRef = React.createRef()
    this.tableGroupRef = React.createRef()
  }

  handleTableClick(e) {
    if (this.props.task === 'delete-table') {
      this.props.removeTableRequest(this.props.id)
      this.props.setTask('edit-room')
    }
    if (this.props.task === 'edit-room') {
      this.props.setTask('edit-table')
      this.props.setPointSelection('start')
      this.props.selectTable(this.props.id, this.props.match.params.roomID, this.props.seatCount, this.props.coords)
    }
    e.stopPropagation()
  }

  // handleSeatClick(e) {
  //   // first check if we're in the only view where we care about seat clicks
  //   if (this.props.view === 'assign-seats') {
  //     // then check to see if there are actually students in the class
  //     if (this.props.currentStudents.length > 0) {
  //       // now check if the seat is occupied or not
  //       const occupied = e.target.closest('.seat').classList.contains('is-occupied');
  //       if (occupied) {
  //         switch (this.props.task) {
  //           case 'offering-overview':
  //           case 'find-student':
  //             this.props.setTask('student-details');
  //             // Note: IE can't handle data attributes on SVG, apparently...
  //             this.props.setCurrentStudentId(parseInt(e.target.closest('.student').getAttribute('data-studentid')));
  //             break;
  //           case 'student-details':
  //             this.props.setCurrentStudentId(parseInt(e.target.closest('.student').getAttribute('data-studentid')));
  //             break;
  //         }
  //       }
  //       else { // seat is not occupied
  //         switch (this.props.task) {
  //           case 'offering-overview':
  //             this.props.setTask('find-student');
  //             this.props.setCurrentSeatId(e.target.closest('.seat').getAttribute('data-seatid'));
  //             break;
  //           case 'find-student':
  //             this.props.setCurrentSeatId(e.target.closest('.seat').getAttribute('data-seatid'));
  //             break;
  //           case 'student-details':
  //             this.props.setTask('find-student');
  //             this.props.setCurrentSeatId(e.target.closest('.seat').getAttribute('data-seatid'));
  //             break;
  //         }
  //       }
  //     } else {
  //       // empty class!
  //       this.props.requestError('no-students','There are no students in the class to seat!', true);
  //     }
  //   }
  // }

  findOccupant(seat_id) {
    let occupant = null
    this.props.currentStudents.forEach(student => {
      const assigned_seat = student.seats['offering_' + this.props.currentOffering.id]
      if (assigned_seat === seat_id) {
        occupant = student
      }
    })
    return occupant
  }

  componentDidMount() {
    this.forceUpdate()
  }

  componentDidUpdate(prevProps) {
    // these updates ensure that the lines and seats show correctly if props change
    if (prevProps.gridCoords !== this.props.gridCoords) {
      this.forceUpdate()
    }
    if (prevProps.currentStudents.length !== this.props.currentStudents.length) {
      this.forceUpdate()
    }
  }

  render() {

    // make the path string
    let d = ''
    if (this.props.qX !== null && this.props.qY !== null) { // test if there is a curve point set or not
      d = `M ${(this.props.sX * this.props.gridcolumnwidth).toFixed(2)} ${(this.props.sY * this.props.gridrowheight).toFixed(2)}
           Q ${(this.props.qX * this.props.gridcolumnwidth).toFixed(2)} ${(this.props.qY * this.props.gridrowheight).toFixed(2)}
           ${(this.props.eX * this.props.gridcolumnwidth).toFixed(2)} ${(this.props.eY * this.props.gridrowheight).toFixed(2)}`
    } else {
      d = `M ${(this.props.sX * this.props.gridcolumnwidth).toFixed(2)} ${(this.props.sY * this.props.gridrowheight).toFixed(2)}
           L ${(this.props.eX * this.props.gridcolumnwidth).toFixed(2)} ${(this.props.eY * this.props.gridrowheight).toFixed(2)}`
    }

    // make the seat coordinate list
    let path = this.pathRef.current
    let seatCoords = {}
    if (path && path.getTotalLength()) {
      const length = path.getTotalLength()
      let seatCount = this.props.seatCount
      for (let i = 0; i < seatCount; i++) {
        const coords = i === 0 ? path.getPointAtLength(0) : path.getPointAtLength(length / (seatCount - 1) * i)
        const seatID = `${this.props.id}_${i}`
        seatCoords[seatID] = {
          'x': coords.x.toFixed(2),
          'y': coords.y.toFixed(2)
        }
      }
    }

    // create array of seat JSX from seat coordinate list
    let seats = []
    if (seatCoords) {
      const seatSize = this.props.currentRoom.seat_size
      seats = Object.keys(seatCoords).map(key => {

        // for every seat, look for an occupant
        const occupant = this.findOccupant(key)

        // we'll show this if it's empty
        const emptySeat = (
          <g>
            <rect width="40" height="40" rx="3"></rect>
            <g className="plus-person" transform="translate(9, 9)">
              <path d="M15,12 C17.21,12 19,10.21 19,8 C19,5.79 17.21,4 15,4 C12.79,4 11,5.79 11,8 C11,10.21 12.79,12 15,12 Z M6,10 L6,7 L4,7 L4,10 L1,10 L1,12 L4,12 L4,15 L6,15 L6,12 L9,12 L9,10 L6,10 Z M15,14 C12.33,14 7,15.34 7,18 L7,20 L23,20 L23,18 C23,15.34 17.67,14 15,14 Z"></path>
            </g>
          </g>
        )

        // and we'll show this if it has an occupant
        const occupiedSeat = occupant ? (
          <g className='student' data-studentid={occupant.id}>
            <filter id={`picture_${occupant.id}`} x="0%" y="0%" width='100%' height="100%">
              <feImage xlinkHref={`${rootUrl}images/students/${occupant.picture}.jpg`} preserveAspectRatio='xMidYMid slice' />
            </filter>
            <rect filter={`url(#picture_${occupant.id})`} x='0' y='0' width='40' height='40' rx='3' ry='3'/>
          </g>
        ) : ''

        // and show this if we're in edit room view
        const blankSeat = (
          <g>
            <rect width="40" height="40" rx="3"></rect>
          </g>
        )

        // and show this if we're printing and there's no face
        const noFacePrinted = (
          <g>
            <path d="M0 4.444v31.112A4.443 4.443 0 0 0 4.444 40h31.112C38 40 40 38 40 35.556V4.444C40 2 38 0 35.556 0H4.444C1.978 0 0 2 0 4.444zm26.667 8.89A6.658 6.658 0 0 1 20 20a6.658 6.658 0 0 1-6.667-6.667A6.658 6.658 0 0 1 20 6.667a6.658 6.658 0 0 1 6.667 6.666zm-20 17.777c0-4.444 8.889-6.889 13.333-6.889 4.444 0 13.333 2.445 13.333 6.89v2.221H6.667v-2.222z" fill="#CCC" fillRule="nonzero"/>
          </g>
        )

        // seat classes
        const seatClasses = classNames({
          'seat': true,
          'is-selected': key === this.props.currentSeatId && this.props.task === 'find-student' ? true : false,
          'is-occupied': occupant ? true : false
        })

        return (
          <svg
            key={key} data-seatid={key}
            className={seatClasses}
            onClick={(e) => this.handleSeatClick(e)}
            x={ (seatCoords[key].x - (seatSize / 2)) + 'px' } y={ (seatCoords[key].y - (seatSize / 2)) + 'px' }
            width={seatSize} height={seatSize}
            viewBox="0 0 40 40"
          >
            <Route path="/offering" render={() => ( occupant ? occupiedSeat : emptySeat )} />
            <Route path="/room" render={() => ( blankSeat )} />
            <Route path="/print/seating-chart" render={() => ( occupant ? occupiedSeat : noFacePrinted )} />
          </svg>
        )
      })
    }

    const tableClasses = classNames({
      'table':true,
      'is-active': this.props.id === this.props.tempTable.id ? true : false
    })

    return (
      <g id={'table_' + this.props.id} className={tableClasses} ref={this.tableGroupRef} onClick={(e) => this.handleTableClick(e)} >
        <path className='table-path' ref={this.pathRef} d={d} />
        { seats }
      </g>
    )
  }
}

export default Table

Table.propTypes = {
  currentOffering: PropTypes.object.isRequired,
  currentRoom: PropTypes.object.isRequired,
  currentSeatId: PropTypes.string,
  currentStudentId: PropTypes.number,
  currentStudents: PropTypes.array.isRequired,
  eX: PropTypes.number.isRequired,
  gridCoords: PropTypes.any.isRequired,
  gridcolumnwidth: PropTypes.number,
  gridrowheight: PropTypes.number,
  id: PropTypes.number.isRequired,
  seatCount: PropTypes.number,
  removeTableRequest: PropTypes.func.isRequired,
  requestError: PropTypes.func.isRequired,
  selectTable: PropTypes.func.isRequired,
  setPointSelection: PropTypes.func.isRequired,
  setTask: PropTypes.func.isRequired,
  task: PropTypes.string.isRequired,
}