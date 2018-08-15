import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import Select from '../scenes/select/Select'
import Workspace from '../scenes/room/containers/Workspace'

export default class Main extends Component {
  constructor(props) {
    super(props)
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
        </Switch>
      </div>
    )
  }
}

Main.propTypes = {
  view: PropTypes.string,
  setTask: PropTypes.func.isRequired,
  task: PropTypes.string,
}