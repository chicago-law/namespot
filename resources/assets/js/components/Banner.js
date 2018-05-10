import React from 'react'
import { Switch, Route } from 'react-router-dom'
import EditRoomBanner from '../containers/EditRoomBanner'

const seatingChartsBanner = () => (
  <div className="banner-text">
    <h3><i className="far fa-map"></i>Seating Charts</h3>
  </div>
);
const StudentsBanner = () => (
  <div className="banner-text">
    <h3><i className="far fa-users"></i>Students</h3>
  </div>
);
const RoomTemplatesBanner = () => (
  <div className="banner-text">
    <h3><i className="far fa-cog"></i>Room Templates</h3>
  </div>
);

const Banner = () => (
  <div className="banner-container">
    <Switch>
      <Route exact path="/" component={seatingChartsBanner} />
      <Route path="/classes" component={seatingChartsBanner} />
      <Route exact path="/rooms" component={RoomTemplatesBanner} />
      <Route path="/rooms/edit/:id" component={EditRoomBanner} />
      <Route path="/students" component={StudentsBanner} />
    </Switch>
  </div>
)

export default Banner;