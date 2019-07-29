/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { getTransactions } from '../../../utils/api/transactions';
import { loadLastTransaction } from '../../../actions/transactions';
import {
  searchTransactions, searchAccount, fetchVotedDelegateInfo,
} from '../../../actions/search';
import ExplorerTransactions from './explorerTransactions';
import actionTypes from '../../../constants/actions';
import txFilters from '../../../constants/transactionFilters';
import withData from '../../../utils/withData';

const mapStateToProps = (state, ownProps) => ({
  delegate: state.search.delegates[ownProps.address],
  transaction: state.transaction,
  // transactions: state.search.searchResults,
  votes: state.search.votes[ownProps.address],
  count: state.search.transactions[ownProps.address]
    && (state.search.transactions[ownProps.address].count || 0),
  offset: state.search.searchResults.length,
  isSearchInStore: state.search.transactions[ownProps.address] !== undefined,
  loading: state.loading,
  account: state.account,
  bookmarks: state.bookmarks,
  wallets: state.wallets,
  peers: state.peers,
  detailAccount: state.search.accounts[ownProps.address],
  balance: state.search.accounts[ownProps.address]
    && state.search.accounts[ownProps.address].balance,
  activeToken: state.settings.token ? state.settings.token.active : 'LSK',
});

const mapDispatchToProps = {
  fetchVotedDelegateInfo,
  searchAccount,
  searchTransactions,
  addFilter: data => ({ type: actionTypes.addFilter, data }),
  searchUpdateLast: data => ({ data, type: actionTypes.searchUpdateLast }),
  loadLastTransaction,
};

// TODO the sort should be removed when BTC api returns transactions sorted by timestamp
const sortByTimestamp = (a, b) => (
  (!a.timestamp || a.timestamp > b.timestamp) && b.timestamp ? -1 : 1
);

const apis = {
  transactions: {
    apiUtil: (apiClient, params) => getTransactions(params),
    getApiParams: (state, ownProps) => ({
      token: state.settings.token.active,
      address: ownProps.match.params.address,
      networkConfig: state.network,
    }),
    defaultData: {
      data: [],
      meta: {},
      filters: {
        direction: txFilters.all,
      },
    },
    transformResponse: (response, oldData, params) => (
      response.meta.offset > 0 ? {
        ...oldData,
        data: [
          ...oldData.data, ...response.data,
        ].sort(sortByTimestamp),
      } : {
        filters: params.filters,
        ...response,
        data: response.data.sort(sortByTimestamp),
      }
    ),
  },
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withData(apis)(translate()(ExplorerTransactions))));
