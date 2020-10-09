import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';

import { removeSearchParamsFromUrl } from '../../../../utils/searchParams';
import LiskAmount from '../../../shared/liskAmount';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import { PrimaryButton } from '../../../toolbox/buttons';
import Illustration from '../../../toolbox/illustration';
import ToggleIcon from '../toggleIcon';
import TransactionResult from '../../../shared/transactionResult';

import styles from './styles.css';

const unlockTime = 5;

const LiskAmountFormatted = ({ val }) =>
  <span className={styles.subHeadingBold}><LiskAmount val={val} /></span>;

const getMessage = ({ t, locked, unlockable }) => {
  if (!locked && unlockable) {
    return (
      <>
        <LiskAmountFormatted val={unlockable} />
        <span>{t(`will be available to unlock in ${unlockTime}h.`)}</span>
      </>
    );
  } if (locked && !unlockable) {
    return (
      <>
        <LiskAmountFormatted val={locked} />
        <span>{t('LSK will be locked for voting.')}</span>
      </>
    );
  } if (locked && unlockable) {
    return (
      <>
        <span>{t('You have now locked')}</span>
        <LiskAmountFormatted val={locked} />
        <span>{t('LSK for voting and may unlock')}</span>
        <LiskAmountFormatted val={unlockable} />
        <span>{t('LSK in {{unlockTime}} hours.', { unlockTime })}</span>
      </>
    );
  }
  return '';
};

const Result = ({
  t, history, locked, unlockable, error, transactionBroadcasted, transactions,
}) => {
  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal']);
  };

  useEffect(() => {
    if (!error) {
      const tx = transactions.transactionsCreated[0];
      transactionBroadcasted(tx);
    }
  }, []);

  const message = getMessage({ t, unlockable, locked });

  return (
    <section>
      <Box className={styles.container}>
        <header className={styles.header}>
          <ToggleIcon />
          <span className={styles.title}>{t('Voting Confirmation')}</span>
        </header>
        <TransactionResult
          t={t}
          title={t('Votes have been submitted')}
          illustration={error ? 'transactionError' : 'votingSuccess'}
          message={message}
          success={!error}
        />
        <BoxFooter direction="horizontal" className={styles.footer}>
          <PrimaryButton size="l" onClick={closeModal}>
            {t('Back to wallet')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </section>
  );
};

export default Result;
