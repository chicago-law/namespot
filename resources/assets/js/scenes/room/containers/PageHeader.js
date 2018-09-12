import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import PageHeader from '../PageHeader'

const mapStateToProps = (state, ownProps) => {

  // parse any URL parameters
  const urlParams = queryString.parse(ownProps.location.search)
  const withStudents = urlParams.withstudents === 'false' ? false : true

  return {
    currentOffering:state.app.currentOffering,
    currentRoom: state.app.currentRoom,
    withStudents
  }
}

const PageHeaderContainer = withRouter(connect(
  mapStateToProps
)(PageHeader))

export default PageHeaderContainer