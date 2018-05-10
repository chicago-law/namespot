import React from 'react'
import { Switch, Route } from 'react-router-dom'
import SelectClass from '../scenes/SelectClass/SelectClass'
import SelectRoom from '../scenes/SelectRoom/SelectRoom'
import EditRoom from '../scenes/EditRoom/containers/EditRoom'

const Main = ({ offerings, match}) => {
  return (
    <div className='main'>
      <Switch>
        <Route exact path="/" component={SelectClass} />
        <Route path="/classes" component={SelectClass} />
        <Route path={'/rooms'} component={SelectRoom} />
        <Route path={'/room/:id'} component={EditRoom} />
      </Switch>
    </div>
  )
}

export default Main;