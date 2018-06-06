import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import AbEditRoom from '../scenes/Room/containers/AbEditRoom';
import AbEditTable from '../scenes/Room/containers/AbEditTable';
import AbDeleteTable from '../scenes/Room/AbDeleteTable';

export default class ActionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //
    }
  }

  render() {
    return (
      <div>
        <Route exact path={`/room/:roomID`} component={AbEditRoom} />
        <Route path={`/room/:roomID/delete/section`} component={AbDeleteTable} />
        <Route path={`/room/:roomID/section/:sectionID`} component={AbEditTable} />
      </div>
    )
  }
}