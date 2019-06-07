import React from 'react'
import { connect } from 'react-redux'
import { setTask } from '../../../actions'

const AbDeleteTable = ({ dispatch }) => (
  <div className="action-bar action-bar-delete-table">
    <div className="flex-container">
      <p>Click a table below to delete it</p>
    </div>
    <div className="flex-container">
      <button
        type="button"
        className="btn-clear"
        onClick={() => dispatch(setTask('edit-room'))}
      >
        Cancel
      </button>
    </div>
  </div>
  )

export default connect()(AbDeleteTable)
