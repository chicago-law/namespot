import React from 'react';
import { Link } from 'react-router-dom'

const ActionBarEditRoom = ({room, match, selectTable, selectPointType }) => {

  return (
    <div className='action-bar action-bar-edit-room'>
      <div className="flex-container pull-top">
        <h6>Name</h6>
        <h4>{room.name ? room.name : 'Click to add'}<i className="far fa-pencil"></i></h4>
        <h6>Total Seats in Room</h6>
        <h4>15</h4>
      </div>

      <div className="flex-container description pull-top">
        <h6>Description</h6>
        <h4>{room.description ? room.description : 'Click to add'}<i className="far fa-pencil"></i></h4>
      </div>

      <div className="controls">
        <div className="flex-container seat-size">
          <div className='seat-size-slider'>
            <div className='smaller'></div>
            <input type="range" />
            <div className="larger"></div>
          </div>
          <p><small>Seat Size</small></p>
        </div>

        {/* <div className="flex-container">
          <button>
            <i className="far fa-wrench"></i>
            <p><small>Edit<br />Section</small></p>
          </button>
        </div> */}

        <div className="flex-container">
          <Link to={`${match.url}/section/new`} onClick={() => { selectTable('new'); selectPointType('start'); } }>
            <button>
              <i className="far fa-plus-circle"></i>
              <p><small>Add New<br />Section</small></p>
            </button>
          </Link>
        </div>

        <div className="flex-container">
          <button>
            <i className="far fa-trash-alt"></i>
            <p><small>Delete<br />Section</small></p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ActionBarEditRoom;