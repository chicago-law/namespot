import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

class Table extends Component {
  tableGroupRef = React.createRef()
  pathRef = React.createRef()

  getPathString() {
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

    return d
  }

  makeSeatCoords() {
    // look at the table's path and it seat count, and generate pixel
    // coordinates for each seat, storing it in the seatCoords object,
    // which we will then send to the store.
    let path = this.pathRef.current
    let seatCoords = {}
    if (path && path.getTotalLength()) {
      const length = path.getTotalLength()
      let seatCount = this.props.seatCount
      for (let i = 0; i < seatCount; i++) {
        const pxCoords = i === 0 ? path.getPointAtLength(0) : path.getPointAtLength(length / (seatCount - 1) * i)
        const seatID = `${this.props.id}_${i}`
        seatCoords[seatID] = {
          'id': seatID,
          'room_id': this.props.currentRoom.id,
          'table_id': this.props.id,
          'x': pxCoords.x.toFixed(2),
          'y': pxCoords.y.toFixed(2),
          'labelPosition': this.props.labelPosition
        }
      }

      // now add them into the store
      this.props.receiveSeats(seatCoords, this.props.id)
    }
  }

  handleTableClick(e) {
    if (this.props.task === 'delete-table') {
      this.props.removeTableRequest(this.props.id)
      this.props.setTask('edit-room')
    }
    if (this.props.task === 'edit-room') {
      this.props.setTask('edit-table')
      this.props.setPointSelection('start')
      this.props.selectTable(this.props.id, this.props.currentRoom.id, this.props.seatCount, this.props.labelPosition, this.props.gridCoords)
    }
    e.stopPropagation()
  }

  componentDidMount() {
    this.forceUpdate()
    this.makeSeatCoords()
  }

  componentDidUpdate(prevProps) {
    // these updates ensure that the lines and seats show correctly if props change
    if (prevProps.currentRoom != this.props.currentRoom || prevProps.gridCoords !== this.props.gridCoords || prevProps.seatCount != this.props.seatCount) {
      this.makeSeatCoords()
    }
    // ensures update when changing paper size
    if (prevProps.gridrowheight !== this.props.gridrowheight) {
      this.makeSeatCoords()
    }
  }

  render() {
    const { id, tempTable } = this.props
    const d = this.getPathString()

    const tableClasses = classNames({
      'table':true,
      'is-active': id === tempTable.id ? true : false,
    })

    return (
      <g
        id={'table_' + id}
        className={tableClasses}
        ref={this.tableGroupRef}
        onClick={(e) => this.handleTableClick(e)}
      >
        <path className='table-path' ref={this.pathRef} d={d} stroke="#f4f4f4" strokeWidth="15" fill="none" strokeLinecap="round"/>
      </g>
    )
  }
}

export default Table

Table.propTypes = {
  currentOffering: PropTypes.object.isRequired,
  currentRoom: PropTypes.object.isRequired,
  eX: PropTypes.number.isRequired,
  eY: PropTypes.number.isRequired,
  gridCoords: PropTypes.object.isRequired,
  gridcolumnwidth: PropTypes.number,
  gridrowheight: PropTypes.number,
  id: PropTypes.number.isRequired,
  labelPosition: PropTypes.string.isRequired,
  qX: PropTypes.number,
  qY: PropTypes.number,
  receiveSeats: PropTypes.func.isRequired,
  removeTableRequest: PropTypes.func.isRequired,
  requestError: PropTypes.func.isRequired,
  seatCount: PropTypes.number,
  selectTable: PropTypes.func.isRequired,
  setPointSelection: PropTypes.func.isRequired,
  setTask: PropTypes.func.isRequired,
  sX: PropTypes.number.isRequired,
  sY: PropTypes.number.isRequired,
  task: PropTypes.string.isRequired,
  tempTable: PropTypes.object.isRequired
}