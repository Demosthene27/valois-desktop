import React from 'react';
import { TertiaryButtonV2 } from '../../toolbox/buttons/button';
import { displayAccounts } from '../../../utils/ledger';
import { loginType } from '../../../constants/hwConstants';
import routes from '../../../constants/routes';
import AccountCard from './accountCard';
import LoadingIcon from '../loadingIcon';
import styles from './selectAccount.css';

class SelectAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeDevice: null,
      accountOnEditMode: -1,
      hwAccounts: [],
    };

    this.onEditAccount = this.onEditAccount.bind(this);
    this.onChangeAccountTitle = this.onChangeAccountTitle.bind(this);
    this.getAccountsFromDevice = this.getAccountsFromDevice.bind(this);
    this.onSaveNameAccounts = this.onSaveNameAccounts.bind(this);
    this.onAddNewAccount = this.onAddNewAccount.bind(this);
    this.onSelectAccount = this.onSelectAccount.bind(this);
    this.getNameFromAccount = this.getNameFromAccount.bind(this);
  }

  componentDidMount() {
    this.getAccountsFromDevice();
  }

  componentDidUpdate() {
    // istanbul ignore else
    if (this.props.account && this.props.account.address) {
      this.props.history.push(`${routes.dashboard.path}`);
    }
  }

  getNameFromAccount(address) {
    const { settings } = this.props;
    // istanbul ignore else
    if (Array.isArray(settings.hardwareAccounts)) {
      const storedAccount = settings.hardwareAccounts.filter(account =>
        account.address === address);
      return storedAccount.length ? storedAccount[0].name : null;
    }

    return null;
  }

  async getAccountsFromDevice() {
    const {
      device,
      liskAPIClient,
      t,
    } = this.props;
    let activeDevice = '';

    setTimeout(async () => {
      activeDevice = await displayAccounts({
        liskAPIClient,
        loginType: /trezor/ig.test(device.deviceModel) ? loginType.trezor : loginType.ledger,
        hwAccounts: [],
        t,
        device,
      });

      const hwAccounts = activeDevice.hwAccounts.map(account =>
        ({ ...account, name: this.getNameFromAccount(account.address) }));

      this.setState({ activeDevice: { ...activeDevice }, hwAccounts });
    }, 200);
  }

  onEditAccount(index) {
    this.onSaveNameAccounts();
    this.setState({ accountOnEditMode: index });
  }

  onChangeAccountTitle(value, index) {
    const newAccounts = this.state.hwAccounts;
    newAccounts[index].name = value;
    this.setState({ hwAccounts: newAccounts });
  }

  onSaveNameAccounts() {
    const accountNames = this.state.hwAccounts.map(account =>
      ({ address: account.address, name: account.name }));
    this.props.settingsUpdated({ hardwareAccounts: accountNames });
    this.setState({ accountOnEditMode: -1 });
  }

  async onAddNewAccount() {
    const {
      device,
      errorToastDisplayed,
      liskAPIClient,
      t,
    } = this.props;
    const { hwAccounts } = this.state;

    if (hwAccounts[hwAccounts.length - 1].isInitialized) {
      const output = await displayAccounts({
        liskAPIClient,
        loginType: /trezor/ig.test(device.deviceModel) ? loginType.trezor : loginType.ledger,
        hwAccounts,
        t,
        unInitializedAdded: true,
        device,
      });

      const newHWAccounts = hwAccounts.concat([output.hwAccounts[0]]);
      this.setState({ hwAccounts: newHWAccounts });
    } else {
      const label = t('Please use the last not-initialized account before creating a new one!');
      errorToastDisplayed({ label });
    }
  }

  onSelectAccount(account, index) {
    const { login, device } = this.props;

    login({
      publicKey: account.publicKey,
      hwInfo: {
        deviceId: device.deviceId,
        derivationIndex: index,
        deviceModel: device.model,
      },
    });
  }

  render() {
    const { t, prevStep, device } = this.props;
    const { accountOnEditMode, hwAccounts } = this.state;

    return <div>
      <h1>{t('Lisk accounts on {{WalletModel}}', { WalletModel: device.model })}</h1>
      <p>
        {t('Please select the account you’d like to sign in to or')}
        <TertiaryButtonV2
          className={`${styles.createAccountBtn} create-account`}
          onClick={this.onAddNewAccount}
        >
          {t('Create account')}
        </TertiaryButtonV2>
      </p>

      <div className={`${styles.deviceContainer} hw-container`}>
        {
          hwAccounts.length
          ? hwAccounts.map((hwAccount, index) =>
            <AccountCard
              key={index}
              account={hwAccount}
              accountOnEditMode={accountOnEditMode}
              index={index}
              onChangeAccountTitle={this.onChangeAccountTitle}
              onEditAccount={this.onEditAccount}
              onSaveNameAccounts={this.onSaveNameAccounts}
              onSelectAccount={this.onSelectAccount}
              t={t}
            />)
          : <LoadingIcon />
        }
      </div>

      <TertiaryButtonV2 className={'go-back'} onClick={() => prevStep({ jump: 2 })}>
        {t('Go Back')}
      </TertiaryButtonV2>
    </div>;
  }
}

export default SelectAccount;
