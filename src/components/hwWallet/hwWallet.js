import React from 'react';
import to from 'await-to-js';
import Box from '../box';

import UnlockWallet from './unlockWallet';
import LedgerLogin from './ledgerLoginHOC';
import getNetwork from '../../utils/getNetwork';
import { getAccountFromLedgerIndex } from '../../utils/ledger';

import { loginType } from '../../constants/hwConstants';

import styles from './unlockWallet.css';

class HwWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLedgerLogin: true,
    };
  }

  async componentDidMount() {
    this.ledgerLogin();
  }

  handleOnClick() {
    this.ledgerLogin();
  }

  cancelLedgerLogin() {
    this.setState({ isLedgerLogin: false });
  }

  async ledgerLogin() { // eslint-disable-line max-statements
    this.props.loadingStarted('ledgerLogin');

    const finishTimeout = setTimeout(() => {
      this.setState({ isLedgerLogin: false });
      this.props.loadingFinished('ledgerLogin');
    }, 6000);
    let error;
    let ledgerAccount;
    // eslint-disable-next-line prefer-const
    [error, ledgerAccount] = await to(getAccountFromLedgerIndex()); // by default index 0
    if (!error) {
      const network = Object.assign({}, getNetwork(this.props.network));

      if (ledgerAccount.publicKey) {
        clearTimeout(finishTimeout);
        this.props.loadingFinished('ledgerLogin');
        this.setState({ isLedgerLogin: true, isLedgerFirstLogin: true });
      }

      // set active peer
      this.props.liskAPIClientSet({
        publicKey: ledgerAccount.publicKey,
        loginType: loginType.ledger,
        network,
      });
    }
  }

  render() {
    if (this.state.isLedgerLogin) {
      return (
        <Box>
          <LedgerLogin
            loginType={loginType.normal}
            network={getNetwork(this.props.network)}
            cancelLedgerLogin={this.cancelLedgerLogin.bind(this)} />
        </Box>);
    }

    return (
      <Box className={styles.unlockWallet}>
        <UnlockWallet
          handleOnClick={this.handleOnClick.bind(this)}
          cancelLedgerLogin={this.cancelLedgerLogin.bind(this)} />
      </Box>);
  }
}

export default HwWallet;
