/* istanbul ignore file */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Header from './header';
import { getTransactions } from '../../../actions/transactions';
import txFilters from '../../../constants/transactionFilters';
import TabsContainer from '../../toolbox/tabsContainer/tabsContainer';
import DelegateTab from '../../shared/delegate';
import VotesTab from '../../shared/votes';
import WalletTab from './walletTab';

const filterNames = ['message', 'dateFrom', 'dateTo', 'amountFrom', 'amountTo', 'direction'];
/**
 * The implementation of this API endpoint and the ones implemented for Lisk Service
 * are different. this transformer adapts params temporarily before all the APIs
 * are unified. then we can remove this.
 *
 * @param {Object} params - All params and filters provided by WithFilters HOC
 */
const transformParams = params => Object.keys(params)
  .reduce((acc, item) => {
    if (filterNames.includes(item)) acc.filters[item] = params[item];
    else acc[item] = params[item];

    if (typeof params.tab === 'number') acc.filters.direction = params.tab;
    return acc;
  }, { filters: {} });


const Wallet = ({ t, match, history }) => {
  const dispatch = useDispatch();
  const account = useSelector(state => state.account);
  const activeToken = useSelector(state => state.settings.token.active);
  const bookmarks = useSelector(state => state.bookmarks);
  const { discreetMode } = useSelector(state => state.settings);
  const { confirmed, pending, count } = useSelector(state => state.transactions);
  const transactions = {
    data: confirmed,
    loadData: (params) => {
      const modified = transformParams(params);
      modified.address = account.info[activeToken].address;
      dispatch(getTransactions(modified));
    },
    isLoading: false,
    error: false,
    meta: {
      count,
    },
  };

  useEffect(() => {
    if (!confirmed.length) {
      transactions.loadData({
        offset: 0,
        limit: 30,
        direction: txFilters.all,
      });
    }
  }, []);

  return (
    <section>
      <Header
        bookmarks={bookmarks}
        address={account.info[activeToken].address}
        match={match}
        delegate={account.info[activeToken].delegate}
        publicKey={account.info[activeToken].publicKey || ''}
        activeToken={activeToken}
        t={t}
      />
      <TabsContainer>
        <WalletTab
          t={t}
          host={account.info[activeToken].address}
          activeToken={activeToken}
          transactions={transactions}
          discreetMode={discreetMode}
          account={account.info[activeToken]}
          tabName={t('Wallet')}
          pending={pending}
        />
        {activeToken !== 'BTC' ? (
          <VotesTab
            history={history}
            address={account.info[activeToken].address}
            tabName={t('Votes')}
          />
        ) : null}
        {account.info[activeToken].delegate
          ? (
            <DelegateTab
              tabClassName="delegate-statistics"
              tabName={t('Delegate')}
              account={account.info[activeToken]}
            />
          )
          : null}
      </TabsContainer>
    </section>
  );
};

export default withTranslation()(Wallet);
