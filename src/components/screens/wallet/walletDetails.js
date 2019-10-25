import React from 'react';
import { withTranslation } from 'react-i18next';
import AccountVisual from '../../toolbox/accountVisual';
import Box from '../../toolbox/box';
import BoxHeader from '../../toolbox/box/header';
import BoxRow from '../../toolbox/box/row';
import Icon from '../../toolbox/icon';
import LiskAmount from '../../shared/liskAmount';
import CopyToClipboard from '../../toolbox/copyToClipboard';
import DiscreetMode from '../../shared/discreetMode';
import styles from './walletDetails.css';

class WalletDetails extends React.Component {
  render() {
    const {
      balance, t, address, activeToken,
    } = this.props;

    return (
      <Box className={styles.wrapper}>
        <BoxHeader>
          <h1>{t('Wallet details')}</h1>
        </BoxHeader>
        <BoxRow className={styles.row}>
          <AccountVisual
            address={address}
            size={40}
          />
          <div>
            <label>{t('Address')}</label>
            <div className={styles.value}>
              <CopyToClipboard
                value={address}
                className="account-address"
              />
            </div>
          </div>
        </BoxRow>
        <BoxRow className={styles.row}>
          <Icon name="balance" />
          <div>
            <label>{t('Balance')}</label>
            <DiscreetMode>
              <div className={styles.value}>
                <LiskAmount val={balance} />
                {' '}
                {activeToken}
              </div>
            </DiscreetMode>
          </div>
        </BoxRow>
      </Box>
    );
  }
}

export default withTranslation()(WalletDetails);
