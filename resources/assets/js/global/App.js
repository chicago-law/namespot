import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Switch, Route, Redirect } from 'react-router-dom'
import Header from './Header'
import Main from './containers/Main'
import Modals from './containers/Modals'
import Errors from './containers/Errors'
import SeatingChart from '../scenes/printables/containers/SeatingChart'
import FlashCardsDeck from '../scenes/printables/containers/FlashCardsDeck'
import NameTents from '../scenes/printables/containers/NameTents'
import Roster from '../scenes/printables/Roster'
import Footer from './Footer'
import Loading from './Loading'
import { requestSettings } from '../actions'

class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(requestSettings())
  }

  render() {
    const { loading } = this.props

    if (!Object.keys(loading).includes('settings') || loading.settings) {
      return (
        <div style={{ marginTop: '5em' }}>
          <Loading />
        </div>
      )
    }

    return (
      <Switch>

        {/* Print these printables */}
        <Route path='/print/seating-chart/room/:roomid/offering/:offeringid' component={SeatingChart}/>
        <Route path='/print/seating-chart/room/:roomid/' component={SeatingChart}/>
        <Route path='/print/flash-cards/term/:termCode/' component={FlashCardsDeck}/>
        <Route path='/print/flash-cards/offering/:offeringid' component={FlashCardsDeck}/>
        <Route path='/print/name-tents/offering/:offeringid' component={NameTents}/>
        <Route path='/print/roster/' component={Roster}/>

        {/* Redirect home to Class selector */}
        <Route exact path='/' render={() => (
          <Redirect to="/select/offerings" />
        )} />

        {/* Or render the actual app */}
        <Route render={() =>
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
  }
}

function mapStateToProps({ app }) {
  return {
    loading: app.loading,
  }
}

export default withRouter(connect(mapStateToProps)(App))
