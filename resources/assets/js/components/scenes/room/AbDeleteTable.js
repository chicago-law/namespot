import React from 'react'
import { connect } from 'react-redux'
import { setTask } from '../../../actions'

const AbDeleteTable = () => (
  <div className="action-bar action-bar-delete-table">
    <div className="flex-container">
      <p>Click a table below to delete it</p>
    </div>
    <div className="flex-container">
      <a href="javascript:void(0)" onClick={() => setTask('edit-room')}>
        <button className="btn-clear">Cancel</button>
      </a>
    </div>
  </div>
  )

export default connect()(AbDeleteTable)
