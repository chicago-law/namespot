import React from 'react'
import { Switch, Route } from 'react-router-dom'
import BanEditRoom from '../scenes/Room/containers/BanEditRoom'
import BanOffering from '../scenes/Room/containers/BanOffering'

const BanSeatingCharts = () => (
  <div className="banner-text">
    <h3><i className="far fa-map"></i>Seating Charts</h3>
  </div>
);
const BanStudents = () => (
  <div className="banner-text">
    <h3><i className="far fa-users"></i>Students</h3>
  </div>
);
const BanRoomTemplates = () => (
  <div className="banner-text">
    <h3><i className="far fa-cog"></i>Room Templates</h3>
  </div>
);

const Banner = () => (
  <div className="banner-container">
    <Switch>
      <Route exact path="/" component={BanSeatingCharts} />
      <Route path="/select/offerings" component={BanSeatingCharts} />
      <Route path="/select/students" component={BanStudents} />
      <Route exact path="/select/rooms" component={BanRoomTemplates} />
      <Route path="/room/:id" component={BanEditRoom} />
      <Route path="/offering/:id" component={BanOffering} />
    </Switch>
  </div>
)

export default Banner;