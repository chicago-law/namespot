import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BanEditRoom from './scenes/room/BanEditRoom'
import BanOffering from './scenes/room/BanOffering'

const BanSeatingCharts = () => (
  <div className="banner-text">
    <h3><FontAwesomeIcon icon={['far', 'map']} />Classes</h3>
  </div>
)
const BanStudents = () => (
  <div className="banner-text">
    <h3><FontAwesomeIcon icon={['far', 'users']} />Students</h3>
  </div>
)
const BanRoomTemplates = () => (
  <div className="banner-text">
    <h3><FontAwesomeIcon icon={['fas', 'map-marker-alt']} />Rooms</h3>
  </div>
)
const BanSettings = () => (
  <div className="banner-text">
    <h3><FontAwesomeIcon icon={['far', 'cog']} />Settings</h3>
  </div>
)
const BanImport = () => (
  <div className="banner-text">
    <h3><FontAwesomeIcon icon={['far', 'upload']} />Import / Export Data</h3>
  </div>
)
const Ban404 = () => (
  <div className="banner-text">
    <h3><FontAwesomeIcon icon={['far', 'exclamation-triangle']} />404 Error</h3>
  </div>
)

const Banner = () => (
  <div className="banner-container">
    <Switch>
      <Route path="/select/offerings" component={BanSeatingCharts} />
      <Route path="/offering/:id" component={BanOffering} />
      <Route path="/room/:id/:offeringID" component={BanOffering} />
      <Route exact path="/select/rooms" component={BanRoomTemplates} />
      <Route exact path="/room/:id" component={BanEditRoom} />
      <Route path="/students" component={BanStudents} />
      <Route path="/import" component={BanImport} />
      <Route path="/settings" component={BanSettings} />
      <Route component={Ban404} />
    </Switch>
  </div>
)

export default Banner
