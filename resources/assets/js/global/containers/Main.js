import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Main from '../Main'
import { setTask } from '../../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    //
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setTask: (task) => {
      dispatch(setTask(task))
    }
  }
}

const MainContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)

export default MainContainer;