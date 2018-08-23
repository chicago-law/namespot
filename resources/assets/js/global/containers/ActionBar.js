import { connect } from 'react-redux'
import ActionBar from '../ActionBar'
// import {  } from '../../../actions'

const mapStateToProps = (state) => {
  return {
    task:state.app.task
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     //
//   }
// }

const ActionBarContainer = connect(
  mapStateToProps,
  // mapDispatchToProps
)(ActionBar)

export default ActionBarContainer