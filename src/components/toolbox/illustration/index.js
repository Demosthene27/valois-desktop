import React from 'react';
import welcomeLiskDelegates from '../../../assets/images/illustrations/illustration-welcome-to-lisk-delegates-dark.svg';
import yourVoiceMatters from '../../../assets/images/illustrations/illustration-your-voice-matters-dark.svg';
import getRewarded from '../../../assets/images/illustrations/illustration-get-rewarded-dark.svg';
import expandYourKnowledge from '../../../assets/images/illustrations/illustration-expand-your-knowledge-dark.svg';
import ledgerNanoLight from '../../../assets/images/illustrations/illustration-ledger-nano-light.svg';
import trezorLight from '../../../assets/images/illustrations/illustration-trezor-confirm-light.svg';
import transactionSuccess from '../../../assets/images/illustrations/transaction_success.svg';
import transactionError from '../../../assets/images/illustrations/transaction_error.svg';

const illustrations = {
  welcomeLiskDelegates,
  yourVoiceMatters,
  getRewarded,
  expandYourKnowledge,
  ledgerNanoLight,
  trezorLight,
  transactionSuccess,
  transactionError,
};

const Illustration = ({ name, className }) => (
  <img src={illustrations[name]} className={className} />
);
export default Illustration;
