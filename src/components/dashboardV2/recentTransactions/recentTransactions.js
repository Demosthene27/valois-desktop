import React, { Component } from 'react';
import Box from '../../boxV2';
import removeDuplicateTransactions from '../../../utils/transactions';
import TransactionList from './transactionList';
import EmptyState from '../../emptyStateV2';
import svg from '../../../utils/svgIcons';
import links from '../../../constants/externalLinks';
import { tokenMap } from '../../../constants/tokens';
import styles from './recentTransactions.css';

class RecentTransactions extends Component {
  constructor(props) {
    super(props);

    this.getLatestTransactions = this.getLatestTransactions.bind(this);
  }

  getLatestTransactions() {
    const { transactions, settings } = this.props;
    const latestTx = removeDuplicateTransactions(transactions.pending, transactions.confirmed);
    const filteredTxs = latestTx.filter(tx => tx.token === settings.token.active);
    return filteredTxs.length >= 5 ? filteredTxs.slice(0, 5) : filteredTxs;
  }

  render() {
    const {
      account,
      followedAccounts,
      settings,
      t,
    } = this.props;
    const activeToken = tokenMap[settings.token.active];
    const transactionList = this.getLatestTransactions();

    return (
      <Box className={`${styles.box}`}>
      <header>
        <h2 className={styles.title}>{t('Recent {{value}} transactions', { value: activeToken.label })}</h2>
      </header>
      {
        transactionList.length
        ? <TransactionList
            account={account}
            activeToken={activeToken.key}
            followedAccounts={followedAccounts}
            transactions={transactionList}
            t={t}/>
        : <EmptyState
            activeToken={activeToken.key}
            title={t('No Transactions Yet')}
            description={t('A great way to start is to top up your account with some {{value}} tokens.', { value: activeToken.key })}
            icon={svg.icon_empty_recent_transactions}
            btnText={t('Learn more')}
            btnExternalUrl={links.outgoingTransactions}
          />
      }
      </Box>
    );
  }
}

export default RecentTransactions;
