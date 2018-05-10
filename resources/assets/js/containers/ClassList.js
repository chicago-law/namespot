import { connect } from 'react-redux';
import { enterOffering } from '../actions'
import ClassList from '../components/ClassList'

const mapStateToProps = (state) => {
  return {
    offerings:state.entities.offerings,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onOfferingClick: id => {
      dispatch(enterOffering(id))
    }
  }
}

const ClassListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ClassList)

export default ClassListContainer;