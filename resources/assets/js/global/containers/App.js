import { connect } from 'react-redux';
import App from '../App'

// NOT BEING USED!

const mapStateToProps = (state) => {
  return {
    errors: state.app.errors
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     //
//   }
// }

const AppContainer = connect(
  mapStateToProps,
  // mapDispatchToProps
)(App);

export default AppContainer;