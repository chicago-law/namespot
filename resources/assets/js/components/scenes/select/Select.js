import React from 'react'
import { Switch, Route } from 'react-router-dom'
import RoomList from './RoomList'
import OfferingList from './OfferingList'

const Select = () => (
  <div className="select card narrow-wrap">
    <Switch>
      <Route path="/select/offerings" component={OfferingList} />
      <Route path="/select/rooms" component={RoomList} />
    </Switch>
  </div>
)

export default Select
