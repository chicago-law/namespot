import { connect } from 'react-redux';
// import { withRouter } from 'react-router-dom';
import AbDeleteTable from '../AbDeleteTable'
import { setTask } from '../../../actions';

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

const AbDeleteTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AbDeleteTable)

export default AbDeleteTableContainer;