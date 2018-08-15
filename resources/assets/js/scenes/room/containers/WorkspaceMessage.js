import { connect } from 'react-redux'
import WorkspaceMessage from '../WorkspaceMessage'
// import {  } from '../../../actions'

const mapStateToProps = (state) => {
  return {
    pointSelection: state.app.pointSelection
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     //
//   }
// }

const WorkspaceMessageContainer = connect(
  mapStateToProps,
  // mapDispatchToProps
)(WorkspaceMessage)

export default WorkspaceMessageContainer