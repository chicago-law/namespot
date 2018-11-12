import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import Select from '../scenes/select/Select'
import Workspace from '../scenes/room/containers/Workspace'
import Students from '../scenes/studentbody/Students'
import NotFound404 from './NotFound404'
import Import from '../scenes/import/Import'

export default class Main extends Component {
  handleBgClick() {
    if (this.props.view === 'assign-seats' && this.props.task !== 'offering-overview') {
      this.props.setTask('offering-overview')
    }
  }

  componentDidMount() {
    const authedUserId = document.getElementById('root').dataset.authedUser
    authedUserId && this.props.fetchUser(authedUserId)
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
          <Route path='/import/' component={Import} />
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