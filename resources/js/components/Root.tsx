import React, { Component } from 'react';
import App from './App';

class Root extends Component<{}, {}> {
  render() {
    return (
      <div className="container">
        <App heading="THIS IS LARAVEL + TYPESCRIPT + REACT" />
      </div>
    );
  }
}

export default Root
