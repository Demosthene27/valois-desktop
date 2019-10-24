import React from 'react';
import { generatePassphrase } from '../../../utils/passphrase';
import Fees from '../../../constants/fees';
import FirstStep from './firstStep';
import MultiStep from '../../shared/multiStep';
import SummaryStep from './summaryStep';
import routes from '../../../constants/routes';
import styles from './secondPassphrase.css';
import ConfirmPassphrase from './confirmPassphrase';
import RegistrationResult from './registrationResult';

class SecondPassphrase extends React.Component {
  constructor() {
    super();

    this.secondPassphrase = generatePassphrase();
    this.backToPreviousPage = this.backToPreviousPage.bind(this);
    this.goToWallet = this.goToWallet.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  componentWillUnmount() {
    document.body.classList.remove('contentFocused');
  }

  componentDidMount() {
    const { account } = this.props;
    document.body.classList.add('contentFocused');
    if (account.secondPublicKey || account.balance < Fees.setSecondPassphrase) {
      this.props.history.push(`${routes.settings.path}`);
    }
  }

  backToPreviousPage() {
    this.props.history.goBack();
  }

  goToWallet() {
    this.props.history.push(routes.wallet.path);
  }

  render() {
    const { t, account, secondPassphraseRegistered } = this.props;
    return (
      <div className={styles.wrapper}>
        <MultiStep showNav={false} finalCallback={this.goToWallet}>
          <FirstStep
            t={t}
            goBack={this.backToPreviousPage}
            account={{
              ...account,
              passphrase: this.secondPassphrase,
            }}
          />
          <ConfirmPassphrase
            t={t}
            passphrase={this.secondPassphrase}
          />
          <SummaryStep
            secondPassphrase={this.secondPassphrase}
            secondPassphraseRegistered={secondPassphraseRegistered}
            account={account}
            t={t}
          />
          <RegistrationResult t={t} />
        </MultiStep>
      </div>
    );
  }
}

export default SecondPassphrase;
