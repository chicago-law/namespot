import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ActionBarEditTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seatCount:0
    }
  }

  handleCancelClick() {
    this.props.changeMode('edit-room');
  }

  handleSeatCountChange(e) {
    const count = e.target.value;
    this.setState((prevState) => {
      const table = { ...prevState.table, seatCount:count}
      return {
        table:table
      }
    })
  }

  changePointSelector(e) {
    const mode = e.target.dataset.select ? e.target.dataset.select : e.target.parentElement.dataset.select;
    this.props.selectPointType(mode);
  }

  render() {
    return (
      <div className='action-bar action-bar-edit-table'>
        <div className={`flex-container point-selector start-point ${ this.props.newTable.choosing === 'start' ? 'active' : ''}`} data-select="start" onClick={(e) => this.changePointSelector(e)}>
          <button>
            <div className="diagram">
              <svg width="47" height="10" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><circle fill="#2F7AD0" cx="5" cy="5" r="5" /><path d="M10.576 5.5h36.92" stroke="#2F7AD0" strokeLinecap="square" strokeDasharray="4" /></g></svg>
            </div>
            <p><small>Select</small><br/>Start Point</p>
          </button>
        </div>

        <div className={`flex-container point-selector end-point ${this.props.newTable.choosing === 'end' ? 'active' : ''}`} data-select="end" onClick={(e) => this.changePointSelector(e)}>
          <button>
            <div className="diagram">
              <svg width="38" height="10" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M.5 5.5h32.062" stroke="#2F7AD0" strokeLinecap="square" strokeDasharray="4" /><circle fill="#2F7AD0" cx="33" cy="5" r="5" /></g></svg>
            </div>
            <p><small>Select</small><br/>End Point</p>
          </button>
        </div>

        <div className={`flex-container point-selector curve-point ${this.props.newTable.choosing === 'curve' ? 'active' : ''}`} data-select="curve" onClick={(e) => this.changePointSelector(e)}>
          <button>
            <div className="diagram">
              <svg width="57" height="15" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M0 14.287C4.258 8.096 13.507 5 27.747 5s23.49 3.096 27.747 9.287" stroke="#2F7AD0" strokeLinecap="square" strokeDasharray="4"/><circle fill="#2F7AD0" cx="29" cy="5" r="5"/></g></svg>
            </div>
            <p><small>Select</small><br/>Curve Point</p>
          </button>
        </div>

        <div className='flex-container seats-number'>
          <input type='number' value={this.state.seatCount} onChange={(e) => this.handleSeatCountChange(e)}/>
          <p>Seats Along<br/>Section</p>
        </div>

        <div className="save-controls">
          <Link to={`/room/${this.props.match.params.roomID}`}>
            <button className='cancel-changes'><small><i className="far fa-times"></i>Cancel</small></button>
          </Link>
          <Link to={`/room/${this.props.match.params.roomID}`}
            onClick={() => this.props.saveTable(
              this.props.newTable.id,
              this.props.match.params.roomID,
              this.props.newTable.coords,
              this.state.seatCount
          )}>
            <button className='btn-accent apply-changes'>Apply Changes</button>
          </Link>
        </div>
      </div>
    )
  }
}