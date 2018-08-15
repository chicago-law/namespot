import { connect } from 'react-redux'
import WorkspaceMessage from '../WorkspaceMessage'
// import {  } from '../../../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    //
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