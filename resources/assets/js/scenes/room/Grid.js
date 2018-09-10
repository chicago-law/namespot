import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

export default class Grid extends Component {
  handleBlipClick(e) {
    if (this.props.pointSelection) { // only proceed if we're choosing a blip
      const pointType = this.props.pointSelection
      const pointKey = e.target.getAttribute('id')
      if (this.isBlipActive(pointKey, this.props.tempTable)) {
        this.props.savePointToTempTable(null, pointType)
      } else {
        this.props.savePointToTempTable(pointKey, pointType)
      }
    }
  }

  isBlipActive(pointKey, tempTable) {
    // is this point's key the same as either the start, end, or curve property of this.props.tempTable?
    if (tempTable.coords) {
      for (let coordType in tempTable.coords) {
        if (tempTable.coords.hasOwnProperty(coordType)) {
          if (tempTable.coords[coordType] === pointKey) {
            return coordType
          }
        }
      }
    }
  }

  doesBlipBelongToAnyTable(blipKey, tables) {
    // check if this blip is a part of any of the room's tables
    let included = false
    for (let tableKey in tables) {
      for (let coordKey in tables[tableKey].gridCoords) {
        if (tables[tableKey].gridCoords[coordKey] === blipKey) {
          included = true
        }
      }
    }
    return included
  }

  drawBlip(x, y) {
    const key = x + '_' + y
    // shrink blip's radius by 60% if we're on letter paper
    const r = this.props.currentOffering && this.props.currentOffering.paperSize === 'tabloid' ? 13 : 13 * 0.6
    const blipClasses = classNames({
      'blip': true,
      'belongs-to-any-table': this.doesBlipBelongToAnyTable(key, this.props.currentTables),
      'belongs-to-active-table': this.isBlipActive(key, this.props.tempTable),
      'is-being-replaced': this.isBlipActive(key, this.props.tempTable) === this.props.pointSelection ? true : false
    })
    const cx = (x * this.props.gridColumnWidth).toFixed(2)
    const cy = (y * this.props.gridRowHeight).toFixed(2)

    // don't try and return a blip until we have proper coordinate values
    if (isNaN(cx)) {
      return false
    }

    const blip = <circle
      key={key}
      id={key}
      className={blipClasses}
      onClick={(e) => this.handleBlipClick(e)}
      r={r}
      cx={cx} cy={cy}
      x={x} y={y}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    />
    return blip
  }

  makeBlipGrid() {
    let blips = []
    for (let i = 0; i < this.props.gridColumns; i++) {
      for (let j = 0; j < this.props.gridRows; j++) {
        blips.push(this.drawBlip(i, j))
      }
    }
    return blips
  }

  shouldComponentUpdate(prevProps) {
    if (
        this.props.pointSelection != prevProps.pointSelection // point is selected
        || this.props.tempTable.coords != prevProps.tempTable.coords // tempTable coord changes
        || this.props.view !== prevProps.view // view changes
    ) {
      return true
    } else {
      return false
    }
  }

  componentDidMount() {
    this.forceUpdate()
  }

  render() {
    const grid = this.makeBlipGrid()

    return (
      <g className='grid'>
        { grid }
      </g>
    )
  }
}

Grid.propTypes = {
  currentTables: PropTypes.array.isRequired,
  gridColumnWidth: PropTypes.number,
  gridColumns: PropTypes.number,
  gridRowHeight: PropTypes.number,
  gridRows: PropTypes.number,
  pointSelection: PropTypes.string,
  savePointToTempTable: PropTypes.func.isRequired,
  task: PropTypes.string.isRequired,
  tempTable: PropTypes.object,
  view: PropTypes.string
}