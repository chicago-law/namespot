import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import Select from '../scenes/select/Select'
import Workspace from '../scenes/room/containers/Workspace'
import Students from '../scenes/studentbody/Students'
import NotFound404 from './NotFound404'
import ImportExport from '../scenes/import/ImportExport'
import Settings from '../scenes/settings/Settings'

export default class Main extends Component {
  componentDidMount() {
    const authedUserId = document.getElementById('root').dataset.authedUser
    authedUserId && this.props.fetchUser(authedUserId)
  }

  handleBgClick() {
    if (this.props.view === 'assign-seats' && this.props.task !== 'offering-overview') {
      this.props.setTask('offering-overview')
    }
  }

  render() {
    return (
      <div className='main' onClick={() => this.handleBgClick()}>
        <Switch>
          <Route exact path="/" component={Select} />
          <Route path="/select" component={Select} />
          <Route path='/offering/:offeringID' component={Workspace} />
          <Route path='/room/:roomID/:offeringID' component={Workspace} />
          <Route path='/room/:roomID' component={Workspace} />
          <Route path='/students/' component={Students} />
          <Route path='/settings/' component={Settings} />
          <Route path='/import/' component={ImportExport} />
          <Route component={NotFound404} />
        </Switch>
      </div>
    )
  }
}

Main.propTypes = {
  fetchUser: PropTypes.func.isRequired,
  view: PropTypes.string,
  setTask: PropTypes.func.isRequired,
  task: PropTypes.string,
}