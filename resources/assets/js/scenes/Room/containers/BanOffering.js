import { connect } from 'react-redux';
import BanOffering from '../BanOffering'

const mapStateToProps = (state) => {
  return {
    currentOffering:state.app.currentOffering
  }
}

const BanOfferingContainer = connect(
  mapStateToProps
)(BanOffering)

export default BanOfferingContainer;