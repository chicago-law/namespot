import { connect } from 'react-redux';
import {  } from '../../../actions'
import OfferingList from '../OfferingList'

const mapStateToProps = (state) => {
  return {
    offerings:state.entities.offerings,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // onOfferingClick: id => {
    //   dispatch(enterOffering(id))
    // }
  }
}

const OfferingListContainer = connect(
  mapStateToProps,
  // mapDispatchToProps
)(OfferingList)

export default OfferingListContainer;