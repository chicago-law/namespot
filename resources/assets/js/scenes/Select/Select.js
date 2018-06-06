import React from 'react'
import { Switch, Route } from 'react-router-dom'
import RoomList from './containers/RoomList'
import ClassList from './containers/ClassList'

const Select = () => (
  <div className='class-list card narrow-wrap'>
    <Switch>
      <Route exact path="/" component={ClassList} />
      <Route path="/select/classes" component={ClassList} />
      <Route path="/select/rooms" component={RoomList} />
    </Switch>
  </div>
)

export default Select