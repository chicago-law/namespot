import { connect } from 'react-redux';
import BanOffering from '../BanOffering'

const mapStateToProps = (state, ownProps) => {
  let currentOffering;
  if (state.entities.offerings[ownProps.match.params.id]) {
    currentOffering = state.entities.offerings[ownProps.match.params.id];
  }
  return {
    currentOffering,
  }
}

const BanOfferingContainer = connect(
  mapStateToProps
)(BanOffering)

export default BanOfferingContainer;