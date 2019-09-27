/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { settingsUpdated } from '../../../actions/settings';
import Help from './help';

const mapStateToProps = state => ({
  account: state.account,
});

const mapDispatchToProps = {
  settingsUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Help));
