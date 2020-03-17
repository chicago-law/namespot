import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Picker from './picker'
import Editor from './Editor'
import Settings from './Settings'
import Students from './Students'
import ImportExport from './import-export'

const MainContentRouter = () => (
  <Switch>
    <Route exact path="/offerings" component={Picker} />
    <Route exact path="/rooms" component={Picker} />
    <Route exact path="/offerings/:offeringId" component={Editor} />
    <Route exact path="/rooms/:roomId/:offeringId?" component={Editor} />
    <Route exact path="/students" component={Students} />
    <Route exact path="/import-export" component={ImportExport} />
    <Route exact path="/settings" component={Settings} />
    <Redirect to="/offerings" />
  </Switch>
)

export default MainContentRouter
