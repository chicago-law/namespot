import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ActionBar from '../ActionBar'
// import {  } from '../../../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    task:state.app.task
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     //
//   }
// }

const ActionBarContainer = withRouter(connect(
  mapStateToProps,
  // mapDispatchToProps
)(ActionBar))

export default ActionBarContainer;