import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Select from '../scenes/Select/Select'
import Room from '../scenes/Room/containers/Room'

const Main = ({ setTask, match }) => {
  return (
    <div className='main'>
      <Switch>
        <Route exact path="/" component={Select} />
        <Route path="/select" component={Select} />}
        <Route path='/room/:roomID' component={Room} />
        <Route path='/offering/:offeringID' component={Room} />
      </Switch>
    </div>
  )
}

export default Main;