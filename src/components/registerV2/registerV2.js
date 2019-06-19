import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { generatePassphrase } from '../../utils/passphrase';
import { extractAddress } from '../../utils/account';
import HeaderV2 from '../headerV2/index';
import MultiStep from '../multiStep';
import ChooseAvatar from './chooseAvatar';
import BackupPassphrase from './backupPassphrase';
import ConfirmPassphrase from './confirmPassphrase';
import AccountCreated from './accountCreated';
import styles from './registerV2.css';

class RegisterV2 extends React.Component {
  constructor() {
    super();
    this.state = {
      accounts: [],
      selectedAccount: {},
    };

    this.handleSelectAvatar = this.handleSelectAvatar.bind(this);
  }

  componentDidMount() {
    const passphrases = [...Array(5)].map(generatePassphrase);
    const accounts = passphrases.map(pass => ({
      address: extractAddress(pass),
      passphrase: pass,
    }));
    this.setState({
      accounts,
    });
  }

  /* istanbul ignore next */
  handleSelectAvatar(selectedAccount) {
    this.setState({ selectedAccount });
  }

  render() {
    const { accounts, selectedAccount } = this.state;
    return (
      <React.Fragment>
        <HeaderV2 showSettings={false} />
        <div className={`${styles.register} ${grid.row}`}>
          <MultiStep
            className={`${styles.wrapper} ${grid['col-xs-12']} ${grid['col-md-10']} ${grid['col-lg-8']}`}>
            <ChooseAvatar
              accounts={accounts}
              selected={selectedAccount}
              handleSelectAvatar={this.handleSelectAvatar} />
            <BackupPassphrase
              account={selectedAccount} />
            <ConfirmPassphrase
              passphrase={selectedAccount.passphrase} />
            <AccountCreated
              account={selectedAccount} />
          </MultiStep>
        </div>
      </React.Fragment>
    );
  }
}

export default RegisterV2;
