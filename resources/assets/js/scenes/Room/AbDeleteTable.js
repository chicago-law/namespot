import React from 'react'
import PropTypes from 'prop-types'

const AbDeleteTable = ({ setTask }) => {

  return (
    <div className='action-bar action-bar-delete-table'>
      <div className="flex-container">
        <p>Click a table below to delete it</p>
      </div>
      <div className="flex-container">
        <a href='javascript:void(0)' onClick={ () => setTask('edit-room') }>
          <button className='btn-clear'><i className="far fa-times"></i> Cancel</button>
        </a>
      </div>
    </div>
  )
}

export default AbDeleteTable

AbDeleteTable.propTypes = {
  setTask: PropTypes.func.isRequired
}