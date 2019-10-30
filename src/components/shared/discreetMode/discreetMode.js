import React, { Component } from 'react';
import PropTypes from 'prop-types';
import routes from '../../../constants/routes';
import styles from './discreetMode.css';
import { getTokenFromAddress } from '../../../utils/api/transactions';

class DiscreetMode extends Component {
  handleBlurOnTransactionDetailsPage() {
    const { account, addresses } = this.props;
    const token = getTokenFromAddress(addresses[0]);
    return account.info && addresses.some(address => address === account.info[token].address);
  }

  handleBlurOnOtherWalletPage() {
    const { account, location } = this.props;
    const address = location.pathname.split('/').pop();
    const token = getTokenFromAddress(address);
    return account.info && address === account.info[token].address;
  }

  shouldEnableDiscreetMode() {
    const {
      addresses, location, isDiscreetMode, shouldEvaluateForOtherAccounts,
    } = this.props;
    if (!isDiscreetMode) return false;

    if (shouldEvaluateForOtherAccounts) {
      if (addresses.length && location.pathname.includes(routes.transactions.path)) {
        return this.handleBlurOnTransactionDetailsPage();
      }

      if (location.pathname.includes(routes.accounts.path)) {
        return this.handleBlurOnOtherWalletPage();
      }
    }
    return true;
  }

  render() {
    const discreetModeClass = this.shouldEnableDiscreetMode() ? styles.discreetMode : '';
    return <div className={discreetModeClass}>{this.props.children}</div>;
  }
}

DiscreetMode.defaultProps = {
  addresses: [],
  shouldEvaluateForOtherAccounts: false,
};

DiscreetMode.propTypes = {
  account: PropTypes.object.isRequired,
  addresses: PropTypes.array,
  isDiscreetMode: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  shouldEvaluateForOtherAccounts: PropTypes.bool,
};


export default DiscreetMode;
