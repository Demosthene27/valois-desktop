import React from 'react';
import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import registerStyles from './register.css';
import styles from './confirmPassphrase.css';
import PassphraseRenderer from '../../shared/passphraseRenderer';

const ConfirmPassphrase = ({
  t, passphrase, onConfirmPassphrase, prevStep, nextStep,
}) => (
  <React.Fragment>
    <div className={`${registerStyles.titleHolder} ${grid['col-xs-10']}`}>
      <h1>
        {t('Confirm your passphrase')}
      </h1>
      <p className={styles.text}>{t('Keep it safe as it is the only way to access your wallet.')}</p>
    </div>

    <div className={`${grid['col-sm-10']} ${styles.passphraseContainer}`}>
      <PassphraseRenderer
        showInfo
        passphrase={passphrase}
        nextStep={(params) => {
          onConfirmPassphrase();
          nextStep(params);
        }}
        prevStep={prevStep}
        isConfirmation
      />
    </div>
  </React.Fragment>
);

export default withTranslation()(ConfirmPassphrase);
