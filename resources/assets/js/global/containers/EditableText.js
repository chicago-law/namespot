import { connect } from 'react-redux';
import EditableText from '../EditableText';
import { requestError } from '../../actions';

const mapStateToProps = (state) => {
  return {
    //
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestError: (type, message, shouldLeave) => {
      dispatch(requestError(type, message, shouldLeave))
    }
  }
}

const EditableTextContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditableText);

export default EditableTextContainer;