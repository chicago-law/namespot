import React from 'react'
import PropTypes from 'prop-types'
import helpers from '../../bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AbDivider from '../../global/AbDivider'

export default class AbEditTable extends React.Component {
  state = {
    seatCount: this.props.tempTable.seatCount
  }

  findAncestor(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el
  }

  handlePointSelectorButtonClick(e) {
    const mode = e.target.dataset.select
      ? e.target.dataset.select
      : this.findAncestor(e.target, 'point-selector').dataset.select
    if (mode !== this.props.pointSelection) {
      // activating the button
      this.props.setPointSelection(mode)
    } else {
      // deactivating the button
      this.props.setPointSelection(null)
    }
  }

  onLabelPosButtonClick() {
    this.props.setModal('label-position',true)
  }

  handleSeatCountChange(e) {
    const seatCount = e.target.value
    this.setState({ seatCount })
    this.props.setSeatCount(seatCount)
  }

  handleCancelClick() {
    this.props.clearTempTable()
    this.props.setTask('edit-room')
    this.props.setPointSelection(null)
  }

  nudgeTable = (direction) => {
    const { start, curve, end } = this.props.tempTable.coords
    let [ sX, sY ] = start.split('_')
    let [ qX, qY ] = curve.split('_')
    let [ eX, eY ] = end.split('_')
    sX = parseInt(sX)
    sY = parseInt(sY)
    qX = qX === 'null' ? null : parseInt(qX)
    qY = qY === 'null' ? null : parseInt(qY)
    eX = parseInt(eX)
    eY = parseInt(eY)

    switch (direction) {
      case 'up':
        if (sY - 1 >= 0 && eY - 1 >= 0 && (qY === null || qY - 1 >= 0)) {
          this.props.savePointToTempTable(`${sX}_${sY - 1}`, 'start')
          this.props.savePointToTempTable(`${eX}_${eY - 1}`, 'end')
          qY !== null && this.props.savePointToTempTable(`${qX}_${qY - 1}`, 'curve')
        }
        break
      case 'down':
        if (sY + 1 <= 37 && eY + 1 <= 37 && (qY === null || qY + 1 <= 37)) {
          this.props.savePointToTempTable(`${sX}_${sY + 1}`, 'start')
          this.props.savePointToTempTable(`${eX}_${eY + 1}`, 'end')
          qY !== null && this.props.savePointToTempTable(`${qX}_${qY + 1}`, 'curve')
        }
        break
      case 'left':
        if (sX - 1 >= 0 && eX - 1 >= 0 && (qX === null || qX - 1 >= 0)) {
          this.props.savePointToTempTable(`${sX - 1}_${sY}`, 'start')
          this.props.savePointToTempTable(`${eX - 1}_${eY}`, 'end')
          qX !== null && this.props.savePointToTempTable(`${qX - 1}_${qY}`, 'curve')
        }
        break
      case 'right':
        if (sX + 1 <= 77 && eX + 1 <= 77 && (qX === null || qX + 1 <= 77)) {
          this.props.savePointToTempTable(`${sX + 1}_${sY}`, 'start')
          this.props.savePointToTempTable(`${eX + 1}_${eY}`, 'end')
          qX !== null && this.props.savePointToTempTable(`${qX + 1}_${qY}`, 'curve')
        }
        break
    }

  }

  handleApplyChangesClick() {
    const { tempTable, match } = this.props
    // check if we have both a start point and an end point
    if (
      tempTable.coords.hasOwnProperty('start')
      && tempTable.coords.start !== null
      && tempTable.coords.hasOwnProperty('end')
      && tempTable.coords.end !== null
    ) {
      this.props.saveNewTable(tempTable.id, match.params.roomID, tempTable.coords, tempTable.seatCount, tempTable.labelPosition)
      this.props.clearTempTable()
      this.props.setTask('edit-room')
      this.props.setPointSelection(null)
    } else {
      this.props.requestError('start-end-required', 'Both a starting point and an ending point are required for all tables', true)
    }
  }

  onKeyDown = (e) => {
    switch (e.which) {
      case 27:
        this.handleCancelClick()
        break
      case 13:
        this.handleApplyChangesClick()
        break
      case 38:
        this.nudgeTable('up')
        e.preventDefault()
        break
      case 40:
        this.nudgeTable('down')
        e.preventDefault()
        break
      case 37:
        this.nudgeTable('left')
        e.preventDefault()
        break
      case 39:
        this.nudgeTable('right')
        e.preventDefault()
        break
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
  }

  render() {
    return (
      <div className='action-bar action-bar-edit-table'>

        {/* Select Start Point Button */}
        <div className={`flex-container point-selector start-point ${ this.props.pointSelection === 'start' ? 'active' : ''}`} data-select="start" onClick={(e) => this.handlePointSelectorButtonClick(e)}>
          <button className='big-button'>
            <div className="diagram">
              <svg width="47" height="33" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><circle fill="#2F7AD0" cx="5" cy="15" r="5" /><path d="M10.576 14.5h36.92" stroke="#ccc" strokeLinecap="round" strokeWidth="2"/></g></svg>
            </div>
            <p>Select<br/>Start Point</p>
          </button>
        </div>

        {/* Select Curve Point button */}
        <div className={`flex-container point-selector curve-point ${this.props.pointSelection === 'curve' ? 'active' : ''}`} data-select="curve" onClick={(e) => this.handlePointSelectorButtonClick(e)}>
          <button className='big-button'>
            <div className="diagram">
              {/* <svg width="57" height="15" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M0 14.287C4.258 8.096 13.507 5 27.747 5s23.49 3.096 27.747 9.287" stroke="#2F7AD0" strokeLinecap="round" strokeDasharray="4" /><circle fill="#2F7AD0" cx="29" cy="5" r="5" /></g></svg> */}
              <svg width="61" height="33" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M30.5 5.5l-30 27M33.5 5.5l28 26" stroke="#979797" strokeLinecap="round" strokeDasharray="5"/><path d="M4 30.287C8.258 24.096 17.507 21 31.747 21s23.49 3.096 27.747 9.287" stroke="#ccc" strokeWidth="2" strokeLinecap="round"/><circle fill="#2F7AD0" cx="32" cy="5" r="5"/></g></svg>
            </div>
            <p>Select<br />Curve Point</p>
          </button>
        </div>

        {/* select end point button */}
        <div className={`flex-container point-selector end-point ${this.props.pointSelection === 'end' ? 'active' : ''}`} data-select="end" onClick={(e) => this.handlePointSelectorButtonClick(e)}>
          <button className='big-button'>
            <div className="diagram">
              <svg width="38" height="33" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M.5 14.5h32.062" stroke="#ccc" strokeLinecap="round" strokeWidth="2"/><circle fill="#2F7AD0" cx="33" cy="15" r="5" /></g></svg>
            </div>
            <p>Select<br/>End Point</p>
          </button>
        </div>

        <AbDivider />

        {/* Nudge Up */}
        <div className='flex-container nudge' onClick={() => this.nudgeTable('up')}>
          <button className='big-button'>
            <FontAwesomeIcon icon={['far', 'long-arrow-up']} />
            <p>Nudge<br/>Up</p>
          </button>
        </div>

        {/* Nudge Down */}
        <div className='flex-container nudge' onClick={() => this.nudgeTable('down')}>
          <button className='big-button'>
            <FontAwesomeIcon icon={['far', 'long-arrow-down']} />
            <p>Nudge<br/>Down</p>
          </button>
        </div>

        {/* Nudge Left */}
        <div className='flex-container nudge' onClick={() => this.nudgeTable('left')}>
          <button className='big-button'>
            <FontAwesomeIcon icon={['far', 'long-arrow-left']} />
            <p>Nudge<br/>Left</p>
          </button>
        </div>

        {/* Nudge Right */}
        <div className='flex-container nudge' onClick={() => this.nudgeTable('right')}>
          <button className='big-button'>
            <FontAwesomeIcon icon={['far', 'long-arrow-right']} />
            <p>Nudge<br/>Right</p>
          </button>
        </div>

        <AbDivider />

        {/* set number of seats */}
        <div className='flex-container seats-number'>
          <input type='number' value={this.state.seatCount} onChange={(e) => this.handleSeatCountChange(e)}/>
          <p>Number of<br/>Seats</p>
        </div>

        {/* set label position */}
        <div className={'flex-container label-position'} onClick={(e) => this.onLabelPosButtonClick(e)}>
          <button className='big-button'>
            <img src={`${helpers.rootUrl}images/label-position.png`} alt='label position button'/>
            <p>Label Position:<br/>{this.props.tempTable.labelPosition}</p>
          </button>
        </div>


        {/* Save / Cancel controls */}
        <div className="save-controls">
          <a href='javascript:void(0);'>
            <button onClick={() => this.handleCancelClick()} className='btn-clear'>Cancel</button>
          </a>
          <a href="javascript:void(0)">
            <button onClick={() => this.handleApplyChangesClick()} className='btn-accent save-changes'>Save Table</button>
          </a>
        </div>
      </div>
    )
  }
}

AbEditTable.propTypes = {
    clearTempTable: PropTypes.func.isRequired,
    currentRoom: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    pointSelection: PropTypes.string,
    requestError:PropTypes.func.isRequired,
    saveNewTable:PropTypes.func.isRequired,
    setPointSelection: PropTypes.func.isRequired,
    setModal: PropTypes.func.isRequired,
    setSeatCount: PropTypes.func.isRequired,
    setTask: PropTypes.func.isRequired,
    task: PropTypes.string,
    tempTable: PropTypes.object,
    view: PropTypes.string
  }