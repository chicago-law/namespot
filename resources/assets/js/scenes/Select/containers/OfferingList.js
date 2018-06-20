import { connect } from 'react-redux';
import OfferingList from '../OfferingList'
import { setView, requestOfferings } from '../../../actions';

const mapStateToProps = (state) => {
  return {
    offerings:state.entities.offerings,
    loading:state.app.loading,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setView: (view) => {
      dispatch(setView(view))
    },
    requestOfferings: termCode => {
      dispatch(requestOfferings(termCode))
    }
  }
}

const OfferingListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OfferingList)

export default OfferingListContainer;