/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import Select from './scenes/select/Select'
import WorkspaceContainer from './scenes/room/WorkspaceContainer'
import Students from './scenes/studentbody/Students'
import NotFound404 from './NotFound404'
import ImportExport from './scenes/import/ImportExport'
import Settings from './scenes/settings/Settings'
import { setTask } from '../actions'

class Main extends Component {
  // This click handler seems weird. Refactor?
  handleBgClick() {
    const { dispatch, task, view } = this.props
    if (view === 'assign-seats' && task !== 'offering-overview') {
      dispatch(setTask('offering-overview'))
    }
  }

  render() {
    return (
      <div className="main" onClick={() => this.handleBgClick()}>
        <Switch>
          <Route path="/select" component={Select} />
          <Route path="/offering/:offeringId" component={WorkspaceContainer} />
          <Route path="/room/:roomId/:offeringId" component={WorkspaceContainer} />
          <Route path="/room/:roomId" component={WorkspaceContainer} />
          <Route path="/students/" component={Students} />
          <Route path="/import/" component={ImportExport} />
          <Route path="/settings/" component={Settings} />
          <Route component={NotFound404} />
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = ({ app }) => ({
  view: app.view,
  task: app.task,
})

export default connect(mapStateToProps)(Main)
