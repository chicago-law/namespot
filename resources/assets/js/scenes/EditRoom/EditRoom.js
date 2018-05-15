import React, { Component } from 'react';
import Grid from '../../components/containers/Grid'

export default class EditRoom extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className='outer-grid-container'>
          <Grid match={this.props.match}/>
        </div>
      </div>
    );
  }
}