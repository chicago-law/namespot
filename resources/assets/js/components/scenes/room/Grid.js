import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames/bind'
import { savePointToTempTable } from '../../../actions'

class Grid extends Component {
  shouldComponentUpdate(prevProps) {
    const {
      currentTables,
      pointSelection,
      tempTable,
      view,
    } = this.props
    if (
        currentTables.length !== prevProps.currentTables.length // tables just loaded
        || pointSelection !== prevProps.pointSelection // point is selected
        || tempTable.coords !== prevProps.tempTable.coords // tempTable coord changes
        || view !== prevProps.view // view changes
    ) {
      return true
    }
    return false
  }

  handleBlipClick = (e) => {
    const { dispatch, pointSelection, tempTable } = this.props
    if (pointSelection) { // only proceed if we're choosing a blip
      const pointType = pointSelection
      const pointKey = e.target.getAttribute('id')
      if (this.isBlipActive(pointKey, tempTable)) {
        dispatch(savePointToTempTable(null, pointType))
      } else {
        dispatch(savePointToTempTable(pointKey, pointType))
      }
    }
  }

  isBlipActive = (blipKey, tempTable) => {
    // is this blip's key the same as either the start, end,
    // or curve property of this.props.tempTable?
    if (tempTable.coords) {
      let activeType = false
      Object.keys(tempTable.coords).forEach((type) => {
        if (tempTable.coords[type] === blipKey) {
          activeType = type
        }
      })
      return activeType
    }
    return false
  }

  doesBlipBelongToAnyTable = (blipKey, tables) => (
    tables.some(table => (
      Object.keys(table.gridCoords).some(type => (
        table.gridCoords[type] === blipKey
      ))
    ))
  )

  drawBlip(x, y) {
    const {
      currentOffering,
      currentTables,
      tempTable,
      pointSelection,
      gridColumnWidth,
      gridRowHeight,
    } = this.props
    const key = `${x}_${y}`
    // shrink blip's radius by 60% if we're on letter paper
    const r = currentOffering && currentOffering.paper_size === 'tabloid' ? 13 : 13 * 0.6
    const blipClasses = classNames({
      blip: true,
      'belongs-to-any-table': this.doesBlipBelongToAnyTable(key, currentTables),
      'belongs-to-active-table': this.isBlipActive(key, tempTable),
      'is-being-replaced': this.isBlipActive(key, tempTable) === pointSelection,
    })
    const cx = (x * gridColumnWidth).toFixed(2)
    const cy = (y * gridRowHeight).toFixed(2)

    const blip = (
      <circle
        key={key}
        id={key}
        className={blipClasses}
        onClick={e => this.handleBlipClick(e)}
        r={r}
        cx={cx}
        cy={cy}
        x={x}
        y={y}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
    )
    return blip
  }

  makeBlipGrid() {
    const { gridColumns, gridRows } = this.props
    const blips = []
    for (let i = 0; i < gridColumns; i++) {
      for (let j = 0; j < gridRows; j++) {
        blips.push(this.drawBlip(i, j))
      }
    }
    return blips
  }

  render() {
    const { currentTables, view } = this.props
    const grid = currentTables.length > 0 || view === 'edit-room' ? this.makeBlipGrid() : ''

    return (
      <g className="grid">
        { grid }
      </g>
    )
  }
}

const mapStateToProps = ({ app, entities }) => {
  // find all tables that belong to this room
  const { tables } = entities
  const currentTables = Object.keys(tables)
    .filter(id => tables[id].room_id === app.currentRoom.id)
    .map(id => tables[id])

  return {
    currentTables,
    pointSelection: app.pointSelection,
    task: app.task,
    tempTable: app.tempTable,
    view: app.view,
  }
}

export default connect(mapStateToProps)(Grid)
