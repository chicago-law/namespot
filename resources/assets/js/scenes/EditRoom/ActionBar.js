import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import ActionBarEditRoom from './containers/ActionBarEditRoom';
import ActionBarEditTable from './containers/ActionBarEditTable';

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
        <Route exact path={`/room/:roomID`} component={ActionBarEditRoom} />
        <Route path={`/room/:roomID/section/:sectionID`} component={ActionBarEditTable} />
      </div>
    )
    // if (this.state.mode === 'edit-room') {
    //   return <ActionBarEditRoom
    //           changeMode={(newMode) => this.changeMode(newMode)}
    //           match={this.props.match}
    //           // roomID={this.props.match.params.id}
    //           // table={this.state.table}
    //         />;
    // }
    // if (this.state.mode === 'edit-table') {
    //   return <ActionBarEditTable
    //           changeMode={(newMode) => this.changeMode(newMode)}
    //           // tableID={this.state.newTable}
    //         />;
    // }
  }
}