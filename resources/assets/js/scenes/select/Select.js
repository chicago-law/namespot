import React from 'react'
import { Switch, Route } from 'react-router-dom'
import RoomList from './containers/RoomList'
import OfferingList from './containers/OfferingList'
import StudentList from './containers/StudentList'

const Select = () => (
  <div className='select card narrow-wrap'>
    <Switch>
      <Route exact path="/" component={OfferingList} />
      <Route path="/select/offerings" component={OfferingList} />
      <Route path="/select/rooms" component={RoomList} />
      <Route path="/select/students" component={StudentList} />
    </Switch>
  </div>
)

export default Select
