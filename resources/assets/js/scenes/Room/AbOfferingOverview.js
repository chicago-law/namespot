import React from 'react';

const AbOfferingOverview = () => {

  return (
    <div className='action-bar action-bar-offering-overview'>
      <div className='click-an-empty-seat'>
        <i className="far fa-user-plus"></i><p>Click an empty seat to place a student!</p>
      </div>
      <div className="offering-overview-controls">
        <button className='big-button'>
          <i className="far fa-cog"></i>
          <p>Edit Tables<br/> and Seats</p>
        </button>
        <button className='big-button'>
          <i className="far fa-print"></i>
          <p>Create<br/>Prints</p>
        </button>
      </div>
    </div>
  );
}

export default AbOfferingOverview;