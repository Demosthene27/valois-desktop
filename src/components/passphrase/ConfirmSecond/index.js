import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import ConfirmSecond from './confirmSecond';
import { secondPassphraseRegisteredFailureReset } from '../../../actions/secondPassphrase';


const mapStateToProps = state => ({
  account: state.account,
  step: state.secondPassphrase.step,
  error: state.secondPassphrase.error,
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  secondPassphraseRegisteredFailureReset: data =>
    dispatch(secondPassphraseRegisteredFailureReset(data)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(translate()(ConfirmSecond)));
