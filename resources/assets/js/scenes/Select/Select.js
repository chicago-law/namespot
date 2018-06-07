import React from 'react'
import { Switch, Route } from 'react-router-dom'
import RoomList from './containers/RoomList'
import OfferingList from './containers/OfferingList'

const Select = () => (
  <div className='select-list card narrow-wrap'>
    <Switch>
      <Route exact path="/" component={OfferingList} />
      <Route path="/select/offerings" component={OfferingList} />
      <Route path="/select/rooms" component={RoomList} />
    </Switch>
  </div>
)

export default Select