import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Header from './Header'
import Main from './containers/Main'
import Modals from './containers/Modals'
import Errors from './containers/Errors'
import SeatingChart from '../scenes/printables/containers/SeatingChart'
import FlashCardsDeck from '../scenes/printables/containers/FlashCardsDeck'
import NameTents from '../scenes/printables/containers/NameTents'
import Roster from '../scenes/printables/Roster'
import Footer from './Footer'

const App = () => (
  <Switch>

    {/* Print these printables */}
    <Route path='/print/seating-chart/room/:roomid/offering/:offeringid' component={SeatingChart}/>
    <Route path='/print/seating-chart/room/:roomid/' component={SeatingChart}/>
    <Route path='/print/flash-cards/term/:termCode/' component={FlashCardsDeck}/>
    <Route path='/print/flash-cards/offering/:offeringid' component={FlashCardsDeck}/>
    <Route path='/print/name-tents/offering/:offeringid' component={NameTents}/>
    <Route path='/print/roster/offering/:offeringid' component={Roster}/>

    {/* Or render the actual app */}
    <Route component={() =>
      <div className='app-container'>
        <Header />
        <Main />
        <Footer />
        <Modals />
        <Errors />
      </div>
    }/>

  </Switch>
)

export default App