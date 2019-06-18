import React from 'react';

import { fromRawLsk } from '../../utils/lsk';
import AccountVisual from '../accountVisual';
import Fees from '../../constants/fees';
import TransactionSummary from '../transactionSummary';

import styles from './secondPassphrase.css';

const SummaryStep = ({
  t, account, prevStep, nextStep, secondPassphrase, secondPassphraseRegistered, finalCallback,
}) => (
  <TransactionSummary
    title={t('Register 2nd passphrase summary')}
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
                title: t('Registration completed'),
                illustration: 'votingSuccess',
                message: t(''),
                primaryButon: {
                  title: t('Go to Wallet'),
                  className: 'go-to-wallet',
                  onClick: finalCallback,
                },
              } : {
                title: t('Registration failed'),
                illustration: 'votingError',
                message: (error && error.message) || t('Oops, looks like something went wrong. Please try again.'),
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
  >
   <section>
    <label>{t('Account')}</label>
    <label className={styles.account} >
      <AccountVisual address={account.address} size={25} className={styles.avatar} />
      {account.address}
    </label>
   </section>
  </TransactionSummary>
);

export default SummaryStep;
