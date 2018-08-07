import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import App from '../App'
import {  } from '../../actions'

const mapStateToProps = () => {
  return {
    //
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  //
  }
}

const AppContainer = withRouter(connect(
  mapStateToProps,
  // mapDispatchToProps
)(App))

export default AppContainer