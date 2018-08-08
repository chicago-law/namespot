import { connect } from 'react-redux'
import ChartPref from '../ChartPref'
import { requestUpdateOffering } from '../../../actions'

const mapStateToProps = (state) => {
  return {
    currentOffering: state.app.currentOffering
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestUpdateOffering: (offering_id, attribute, value) => {
      dispatch(requestUpdateOffering(offering_id, attribute, value))
    }
  }
}

const ChartPrefContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChartPref)

export default ChartPrefContainer