/* istanbul ignore file */
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getSingleTransaction } from '../../actions/transactions';
import { getAPIClient } from '../../utils/api/network';
import SingleTransaction from './singleTransaction';

const mapStateToProps = state => ({
  address: state.account.address,
  transaction: state.transaction,
  liskAPIClient: getAPIClient(state.settings.token ? state.settings.token.active : 'LSK', state),
  activeToken: state.settings.token ? state.settings.token.active : 'LSK',
});

const mapDispatchToProps = {
  getSingleTransaction,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleTransaction));
