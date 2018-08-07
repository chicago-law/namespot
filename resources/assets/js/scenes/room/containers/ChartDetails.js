import { connect } from 'react-redux'
import ChartDetails from '../ChartDetails'

const mapStateToProps = (state) => {
  return {
    currentOffering:state.app.currentOffering,
    currentRoom: state.app.currentRoom
  }
}

const ChartDetailsContainer = connect(
  mapStateToProps
)(ChartDetails)

export default ChartDetailsContainer