import { connect } from 'react-redux'
import StudentList from '../StudentList'
// import {  } from '../../../actions';

const mapStateToProps = (state) => {
  return {
    loading: state.app.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

const StudentListContainer = connect(
  mapStateToProps,
  // mapDispatchToProps
)(StudentList)

export default StudentListContainer