import { connect } from 'react-redux'
import PageHeader from '../PageHeader'

const mapStateToProps = (state) => {
  return {
    currentOffering:state.app.currentOffering,
    currentRoom: state.app.currentRoom
  }
}

const PageHeaderContainer = connect(
  mapStateToProps
)(PageHeader)

export default PageHeaderContainer