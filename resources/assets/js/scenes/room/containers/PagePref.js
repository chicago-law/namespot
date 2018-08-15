import { connect } from 'react-redux'
import PagePref from '../PagePref'
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

const PagePrefContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PagePref)

export default PagePrefContainer