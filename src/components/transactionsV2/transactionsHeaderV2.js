import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import styles from './transactionRowV2.css';

const TransactionsHeaderV2 = ({ t, isSmallScreen }) => (
  <div className={`${grid.row} ${styles.row} ${styles.header}`} id="transactionsHeader">
    <div className={`${grid['col-xs-6']} ${grid['col-sm-4']} ${grid['col-lg-3']} transactions-header`}>{t('Transaction')}</div>
    <div className={`${styles.hiddenXs} ${grid['col-sm-3']} ${grid['col-lg-3']} transactions-header`}>{t('Details')}</div>
    <div className={`${styles.hiddenXs} ${grid['col-sm-2']} ${grid['col-lg-2']} transactions-header`}>{t('Date')}</div>
    <div className={`${styles.hiddenXs} ${grid['col-sm-1']} ${grid['col-lg-2']} transactions-header`}>{
      isSmallScreen ? t('Fee') : t('Transaction Fee')
    }</div>
    <div className={`${grid['col-xs-6']} ${grid['col-sm-2']} ${grid['col-lg-2']} transactions-header`}>{t('Amount (LSK)')}</div>
  </div>);

export default translate()(TransactionsHeaderV2);
