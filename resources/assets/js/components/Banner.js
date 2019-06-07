import React, { Component } from 'react'
import { withRouter, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BanEditRoom from './scenes/room/BanEditRoom'
import BanOffering from './scenes/room/BanOffering'
import Loading from './Loading'
import { setBannerHeight } from '../actions/app'

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

class Banner extends Component {
  constructor(props) {
    super(props)
    this.bannerRef = React.createRef()
  }

  componentDidMount() {
    const { dispatch } = this.props
    if (this.bannerRef && this.bannerRef.current) {
      const styles = window.getComputedStyle(this.bannerRef.current)
      const height = parseFloat(styles.getPropertyValue('height'))
      dispatch(setBannerHeight(height))
    }
  }

  render() {
    const { loading } = this.props

    // Wait if Offerings or Rooms are being loaded
    if (loading.offerings || loading.rooms) {
      return <Loading />
    }

    return (
      <div className="banner-container" ref={this.bannerRef}>
        <Switch>
          <Route path="/select/offerings" component={BanSeatingCharts} />
          <Route path="/offering/:offeringId" component={BanOffering} />
          <Route path="/room/:id/:offeringId" component={BanOffering} />
          <Route exact path="/select/rooms" component={BanRoomTemplates} />
          <Route exact path="/room/:id" component={BanEditRoom} />
          <Route path="/students" component={BanStudents} />
          <Route path="/import" component={BanImport} />
          <Route path="/settings" component={BanSettings} />
          <Route component={Ban404} />
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = ({ app }) => ({
  loading: app.loading,
})

export default withRouter(connect(mapStateToProps)(Banner))
