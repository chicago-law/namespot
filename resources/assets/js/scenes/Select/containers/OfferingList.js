import { connect } from 'react-redux';
import {  } from '../../../actions'
import OfferingList from '../OfferingList'
import { setView } from '../../../actions';

const mapStateToProps = (state) => {
  return {
    offerings:state.entities.offerings,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setView: (view) => {
      dispatch(setView(view))
    }
  }
}

const OfferingListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OfferingList)

export default OfferingListContainer;