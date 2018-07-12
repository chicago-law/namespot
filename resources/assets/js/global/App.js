import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom';
import Header from './Header'
import Main from './containers/Main'
import Modals from './containers/Modals';
import Errors from './containers/Errors';
import SeatingChart from '../scenes/printables/containers/SeatingChart';

const App = () => {

  return (
    <Switch>

      {/* Print these printables */}
      <Route path='/print/seating-chart/:roomid/:offeringid?' component={SeatingChart}/>
      {/* <Route path='/print/name-tents/offering/:offeringid' component={NameTents}/> */}
      {/* <Route path='/print/flash-cards/offering/:offeringid' component={FlashCards}/> */}
      {/* <Route path='/print/flash-cards/all-students' component={FlashCards}/> */}

      {/* Or render the actual app */}
      <Route component={() =>
        <div className='app-container'>
          <Header />
          <Main />
          <Modals />
          <Errors />
        </div>
      }/>

    </Switch>
  )
}

export default App