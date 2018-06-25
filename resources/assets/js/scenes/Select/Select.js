import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import RoomList from './containers/RoomList'
import OfferingList from './containers/OfferingList'

export default class Select extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='select-list card narrow-wrap'>
        <Switch>
          <Route exact path="/" component={OfferingList} />
          <Route path="/select/offerings" component={OfferingList} />
          <Route path="/select/rooms" component={RoomList} />
        </Switch>
      </div>
    )
  }
}