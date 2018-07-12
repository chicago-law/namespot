import { connect } from 'react-redux';
import Errors from '../Errors'
import { removeError } from '../../actions';

const mapStateToProps = (state) => {
  return {
    errors: state.app.errors
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeError: (name) => {
      dispatch(removeError(name));
    }
  }
}

const ErrorsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Errors);

export default ErrorsContainer;