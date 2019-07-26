/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { loadLastTransaction } from '../../../actions/transactions';
import {
  searchTransactions, searchMoreTransactions, searchAccount, fetchVotedDelegateInfo,
} from '../../../actions/search';
import actionTypes from '../../../constants/actions';
import ExplorerTransactionsV2 from './explorerTransactionsV2';
import txFilters from '../../../constants/transactionFilters';

const mapStateToProps = (state, ownProps) => ({
  delegate: state.search.delegates[state.search.lastSearch],
  transaction: state.transaction,
  transactions: state.search.searchResults,
  votes: state.search.votes[state.search.lastSearch],
  count: state.search.transactions[state.search.lastSearch]
    && (state.search.transactions[state.search.lastSearch].count || 0),
  offset: state.search.searchResults.length,
  activeFilter: state.filters.transactions || txFilters.all,
  isSearchInStore: state.search.transactions[ownProps.address] !== undefined,
  loading: state.loading,
  account: state.account,
  bookmarks: state.bookmarks,
  wallets: state.wallets,
  detailAccount: state.search.accounts[state.search.lastSearch],
  balance: state.search.accounts[state.search.lastSearch]
    && state.search.accounts[state.search.lastSearch].balance,
  activeToken: state.settings.token ? state.settings.token.active : 'LSK',
});

const mapDispatchToProps = {
  fetchVotedDelegateInfo,
  searchAccount,
  searchTransactions,
  searchMoreTransactions,
  addFilter: data => ({ type: actionTypes.addFilter, data }),
  searchUpdateLast: data => ({ data, type: actionTypes.searchUpdateLast }),
  loadLastTransaction,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(ExplorerTransactionsV2)));
