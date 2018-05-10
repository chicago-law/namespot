import React from 'react'
import { Switch, Route } from 'react-router-dom'
import ClassList from '../containers/ClassList'
import RoomList from '../containers/RoomList'
import EditRoom from '../containers/EditRoom'

const Main = ({ offerings, match}) => {
  return (
    <div className='main'>
      <Switch>
        <Route exact path="/" component={ClassList} />
        <Route path="/classes" component={ClassList} />
        <Route exact path={'/rooms'} component={RoomList} />
        <Route path={'/rooms/edit'} component={EditRoom} />
      </Switch>
    </div>
  )
}

export default Main;