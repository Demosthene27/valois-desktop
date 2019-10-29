import React from 'react';
import { fromRawLsk } from '../../../utils/lsk';
import AccountVisual from '../../toolbox/accountVisual';
import Fees from '../../../constants/fees';
import TransactionSummary from '../../shared/transactionSummary';

import styles from './secondPassphrase.css';

const SummaryStep = ({
  t, account, prevStep, nextStep, secondPassphrase, secondPassphraseRegistered, finalCallback,
}) => (
  <TransactionSummary
    title={t('2nd passphrase registration summary')}
    account={account}
    t={t}
    confirmButton={{
      label: t('Register'),
      onClick: () => {
        secondPassphraseRegistered({
          secondPassphrase,
          passphrase: account.passphrase,
          account: account.info.LSK,
          callback: ({ success, error }) => {
            nextStep({
              success,
              ...(success ? {
                header: t('Registration completed'),
                illustration: 'secondPassphraseSuccess',
                title: t('2nd passphrase registration submitted'),
                message: t('You will be notified when your transaction is confirmed.'),
                primaryButon: {
                  title: t('Go to Wallet'),
                  className: 'go-to-wallet',
                  onClick: finalCallback,
                },
              } : {
                header: t('Registration failed'),
                illustration: 'secondPassphraseError',
                title: t('2nd passphrase registration failed'),
                message: t('There was an error on the transaction.'),
                primaryButon: {
                  title: t('Go to Wallet'),
                  onClick: finalCallback,
                },
                error,
              }),
            });
          },
        });
      },
    }}
    cancelButton={{
      label: t('Go back'),
      onClick: prevStep,
    }}
    fee={fromRawLsk(Fees.setSecondPassphrase)}
    confirmation={t('I’m aware registering a 2nd passphrase is irreversible and it will be required to confirm transactions.')}
    classNames={styles.passphraseConfirmation}
    footerClassName={styles.confirmPassphraseFooter}
  >
    <section>
      <label>{t('Account')}</label>
      <label className={styles.account}>
        <AccountVisual address={account.address} size={25} className={styles.avatar} />
        {account.address}
      </label>
    </section>
  </TransactionSummary>
);

export default SummaryStep;
