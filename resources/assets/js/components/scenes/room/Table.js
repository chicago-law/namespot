/* eslint-disable eqeqeq */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames/bind'
import {
 selectTable,
 setTask,
 removeTableRequest,
 receiveSeats,
} from '../../../actions'


class Table extends Component {
  tableGroupRef = React.createRef()

  pathRef = React.createRef()

  componentDidMount() {
    this.forceUpdate()
    this.makeSeatCoords()
  }

  componentDidUpdate(prevProps) {
    const {
      currentRoom, gridCoords, seatCount, gridrowheight,
    } = this.props
    // these updates ensure that the lines and seats show correctly if props change
    if (
      prevProps.currentRoom != currentRoom
      || prevProps.gridCoords !== gridCoords
      || prevProps.seatCount != seatCount
      ) {
      this.makeSeatCoords()
    }
    // ensures update when changing paper size
    if (prevProps.gridrowheight !== gridrowheight) {
      this.makeSeatCoords()
    }
  }

  getPathString() {
    const {
      eX, eY, qX, qY, sX, sY, gridrowheight, gridcolumnwidth,
    } = this.props

    // make the path string
    let d = ''
    if ( // first check if the start and end coords are ready
      sX !== null
      && !Number.isNaN(sX)
      && sY !== null
      && !Number.isNaN(sY)
      && eX !== null
      && !Number.isNaN(eX)
      && eY !== null
      && !Number.isNaN(eY)
    ) {
      if ( // now check if the line should be curved or not
        qX !== null
        && !Number.isNaN(qX)
        && qY !== null
        && !Number.isNaN(qY)
      ) {
        d = `M ${(sX * gridcolumnwidth).toFixed(2)} ${(sY * gridrowheight).toFixed(2)}
             Q ${(qX * gridcolumnwidth).toFixed(2)} ${(qY * gridrowheight).toFixed(2)} ${(eX * gridcolumnwidth).toFixed(2)} ${(eY * gridrowheight).toFixed(2)}`
      } else {
        d = `M ${(sX * gridcolumnwidth).toFixed(2)} ${(sY * gridrowheight).toFixed(2)}
             L ${(eX * gridcolumnwidth).toFixed(2)} ${(eY * gridrowheight).toFixed(2)}`
      }
    }

    return d
  }

  makeSeatCoords() {
    // look at the table's path and it seat count, and generate pixel
    // coordinates for each seat, storing it in the seatCoords object,
    // which we will then send to the store.
    const {
      dispatch, seatCount, id, currentRoom, labelPosition,
    } = this.props

    const path = this.pathRef.current
    const seatCoords = {}
    if (path && path.getTotalLength()) {
      const length = path.getTotalLength()
      for (let i = 0; i < seatCount; i++) {
        const pxCoords = i === 0
          ? path.getPointAtLength(0)
          : path.getPointAtLength(length / (seatCount - 1) * i)
        const seatID = `${id}_${i}`
        seatCoords[seatID] = {
          id: seatID,
          room_id: currentRoom.id,
          table_id: id,
          x: pxCoords.x.toFixed(2),
          y: pxCoords.y.toFixed(2),
          labelPosition,
        }
      }

      // now add them into the store
      dispatch(receiveSeats(seatCoords, id))
    }
  }

  handleTableClick(e) {
    const {
      dispatch, task, id, currentRoom, seatCount, labelPosition, gridCoords,
    } = this.props

    if (task === 'delete-table') {
      dispatch(removeTableRequest(id))
      dispatch(setTask('edit-room'))
    }
    if (task === 'edit-room') {
      dispatch(setTask('edit-table'))
      dispatch(selectTable(id, currentRoom.id, seatCount, labelPosition, gridCoords))
    }
    e.stopPropagation()
  }

  render() {
    const { id, strokeWidth, tempTable } = this.props
    const d = this.getPathString()

    const tableClasses = classNames({
      table: true,
      'is-active': id === tempTable.id,
    })

    return (
      <g
        id={`table_${id}`}
        className={tableClasses}
        ref={this.tableGroupRef}
        onClick={e => this.handleTableClick(e)}
      >
        <path
          className="table-path"
          ref={this.pathRef}
          d={d}
          stroke="#f4f4f4"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
      </g>
    )
  }
}

const mapStateToProps = ({ app, entities }) => ({
    currentRoom: app.currentRoom,
    currentOffering: app.currentOffering,
    seats: entities.seats,
    task: app.task,
    view: app.view,
    tempTable: app.tempTable,
  })

export default connect(mapStateToProps)(Table)
