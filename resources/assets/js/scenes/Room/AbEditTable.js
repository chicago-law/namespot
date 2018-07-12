import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class AbEditTable extends React.Component {
  constructor(props) {
    super(props);
  }

  findAncestor(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
  }

  handlePointSelectorButtonClick(e) {
    const mode = e.target.dataset.select ? e.target.dataset.select : this.findAncestor(e.target, 'point-selector').dataset.select;
    if (mode !== this.props.pointSelection) {
      // activating the button
      this.props.setPointSelection(mode);
    } else {
      // deactivating the button
      this.props.setPointSelection(null);
    }
  }

  handleSeatCountChange(e) {
    const count = e.target.value;
    this.props.setSeatCount(count);
  }

  handleCancelClick() {
    this.props.clearTempTable();
    this.props.setTask('edit-room');
    this.props.setPointSelection(null);
  }

  handleKeyDown(e) {
    if (e.which === 27) {
      this.handleCancelClick();
    }
  }

  handleApplyChangesClick() {
    // first check if we have both a start point and an end point, because those are
    // required for each table.
    if (this.props.tempTable.coords['start'] != null && this.props.tempTable.coords['end'] != null) {
      this.props.saveTable(this.props.tempTable.id, this.props.match.params.roomID, this.props.tempTable.coords, this.props.tempTable.seatCount);
      this.props.clearTempTable();
      this.props.setTask('edit-room');
      this.props.setPointSelection(null);
    } else {
      this.props.requestError('start-end-required', 'Both a starting point and an ending point are required for all tables', true);
    }
  }

  render() {
    return (
      <div className='action-bar action-bar-edit-table' onKeyDown={e => this.handleKeyDown(e)}>

        {/* Select Start Point Button */}
        <div className={`flex-container point-selector start-point ${ this.props.pointSelection === 'start' ? 'active' : ''}`} data-select="start" onClick={(e) => this.handlePointSelectorButtonClick(e)}>
          <button className='big-button'>
            <div className="diagram">
              <svg width="47" height="10" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><circle fill="#2F7AD0" cx="5" cy="5" r="5" /><path d="M10.576 5.5h36.92" stroke="#2F7AD0" strokeLinecap="square" strokeDasharray="4" /></g></svg>
            </div>
            <p>Select<br/>Start Point</p>
          </button>
        </div>

        {/* Select Curve Point button */}
        <div className={`flex-container point-selector curve-point ${this.props.pointSelection === 'curve' ? 'active' : ''}`} data-select="curve" onClick={(e) => this.handlePointSelectorButtonClick(e)}>
          <button className='big-button'>
            <div className="diagram">
              <svg width="57" height="15" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M0 14.287C4.258 8.096 13.507 5 27.747 5s23.49 3.096 27.747 9.287" stroke="#2F7AD0" strokeLinecap="square" strokeDasharray="4" /><circle fill="#2F7AD0" cx="29" cy="5" r="5" /></g></svg>
            </div>
            <p>Select<br />Curve Point</p>
          </button>
        </div>

        {/* select end point button */}
        <div className={`flex-container point-selector end-point ${this.props.pointSelection === 'end' ? 'active' : ''}`} data-select="end" onClick={(e) => this.handlePointSelectorButtonClick(e)}>
          <button className='big-button'>
            <div className="diagram">
              <svg width="38" height="10" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M.5 5.5h32.062" stroke="#2F7AD0" strokeLinecap="square" strokeDasharray="4" /><circle fill="#2F7AD0" cx="33" cy="5" r="5" /></g></svg>
            </div>
            <p>Select<br/>End Point</p>
          </button>
        </div>

        {/* set number of seats */}
        <div className='flex-container seats-number'>
          <input type='number' value={this.props.tempTable.seatCount} onChange={(e) => this.handleSeatCountChange(e)}/>
          <p>Seats Along<br/>Section</p>
        </div>

        {/* Save / Cancel controls */}
        <div className="save-controls">
          <a href='javascript:void(0);'>
            <button onClick={() => this.handleCancelClick()} className='cancel-changes'><i className="far fa-times"></i>Cancel</button>
          </a>
          <a href="javascript:void(0)" >
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
    pointSelection: PropTypes.string,
    saveTable:PropTypes.func.isRequired,
    setPointSelection: PropTypes.func.isRequired,
    setSeatCount: PropTypes.func.isRequired,
    setTask: PropTypes.func.isRequired,
    task: PropTypes.string,
    tempTable: PropTypes.object,
    view: PropTypes.string
  }