import React from 'react';
import Box from '../box';
import UnlockWallet from './unlockWallet';
import LedgerLogin from './ledgerLogin';

import styles from './unlockWallet.css';

class Ledger extends React.Component {
  handleOnClick() {
    this.props.ledgerLogin();
  }

  render() {
    if (this.props.isLedgerLogin) {
      return (
          <Box>
            <LedgerLogin
              network={this.props.network}
              cancelLedgerLogin={this.props.cancelLedgerLogin} />
          </Box>);
    }

    return (
      <Box className={styles.unlockWallet}>
        <UnlockWallet
          handleOnClick={this.handleOnClick.bind(this)}
          cancelLedgerLogin={this.props.cancelLedgerLogin} />
      </Box>);
  }
}

export default Ledger;
