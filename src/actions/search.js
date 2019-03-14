import actionTypes from '../constants/actions';
import { loadingStarted, loadingFinished } from '../actions/loading';
import { getAccount } from '../utils/api/account';
import { getDelegate, getVoters, getVotes, listDelegates } from '../utils/api/delegate';
import { getTransactions } from '../utils/api/transactions';
import { getBlocks } from '../utils/api/blocks';
import searchAll from '../utils/api/search';
import transactionTypes from '../constants/transactionTypes';
import { updateWallet } from './wallets';

const searchDelegate = ({ publicKey, address }) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    getDelegate(liskAPIClient, { publicKey }).then((response) => {
      getTransactions({
        liskAPIClient, address, limit: 1, type: transactionTypes.registerDelegate,
      }).then((transactions) => {
        getBlocks(liskAPIClient, { generatorPublicKey: publicKey, limit: 1 }).then((block) => {
          dispatch({
            data: {
              delegate: {
                ...response.data[0],
                lastBlock: (block.data[0] && block.data[0].timestamp) || '-',
                txDelegateRegister: transactions.data[0],
              },
              address,
            },
            type: actionTypes.searchDelegate,
          });
        });
      });
    });
  };

const searchVotes = ({ address }) =>
  async (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    /* istanbul ignore else */
    if (!liskAPIClient) return;
    dispatch(loadingStarted(actionTypes.searchVotes));
    const fetchedVotes = await getVotes(liskAPIClient, { address, offset: 0, limit: 101 });
    const delegates = await listDelegates(liskAPIClient, { limit: 101 });

    const asyncVotes = fetchedVotes.data.votes.map(async (vote) => {
      const delegate = delegates.data.find(d => d.username === vote.username)
        || await getDelegate(liskAPIClient, { username: vote.username }).then(d => d.data[0]);

      return ({ ...vote, ...delegate });
    });

    const votes = await Promise.all(asyncVotes);
    votes.sort((a, b) => {
      if (+a.rank > +b.rank) return 1;
      return -1;
    });

    dispatch({
      type: actionTypes.searchVotes,
      data: { votes, address },
    });
    dispatch(loadingFinished(actionTypes.searchVotes));
  };

const searchVoters = ({
  address, publicKey, offset, limit, append,
}) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    /* istanbul ignore else */
    if (liskAPIClient) {
      getVoters(liskAPIClient, {
        publicKey, offset, limit,
      }).then(response =>
        dispatch({
          type: actionTypes.searchVoters,
          data: {
            append: append || false,
            voters: response.data.voters,
            votersSize: response.data.votes,
            address,
          },
        }));
    }
  };

export const searchMoreVoters = ({ address, offset = 0, limit = 100 }) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    getAccount(liskAPIClient, address).then((response) => {
      const accountData = {
        ...response,
      };
      if (accountData.publicKey) {
        dispatch(searchVoters({
          address, publicKey: accountData.publicKey, offset, limit, append: true,
        }));
      }
    });
  };

export const searchAccount = ({ address }) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    /* istanbul ignore else */
    if (liskAPIClient) {
      getAccount(liskAPIClient, address).then((response) => {
        const accountData = {
          ...response,
        };
        if (accountData.publicKey) {
          dispatch(searchDelegate({ publicKey: accountData.publicKey, address }));
          dispatch(searchVoters({ address, publicKey: accountData.publicKey }));
        }
        dispatch({ data: accountData, type: actionTypes.searchAccount });
        dispatch(updateWallet(response, getState().peers));
      });
      dispatch(searchVotes({ address }));
    }
  };

export const searchTransactions = ({
  address, limit, filter, showLoading = true, customFilters = {},
}) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    if (showLoading) dispatch(loadingStarted(actionTypes.searchTransactions));
    if (liskAPIClient) {
      getTransactions({
        liskAPIClient, address, limit, filter, customFilters,
      })
        .then((transactionsResponse) => {
          dispatch({
            data: {
              address,
              transactions: transactionsResponse.data,
              count: parseInt(transactionsResponse.meta.count, 10) || 0,
              filter,
              customFilters,
            },
            type: actionTypes.searchTransactions,
          });
          if (filter !== undefined) {
            dispatch({
              data: {
                filterName: 'transactions',
                value: filter,
              },
              type: actionTypes.addFilter,
            });
          }
          if (showLoading) dispatch(loadingFinished(actionTypes.searchTransactions));
        });
    }
  };

export const searchMoreTransactions = ({
  address, limit, offset, filter, customFilters = {},
}) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    dispatch(loadingStarted(actionTypes.searchMoreTransactions));
    getTransactions({
      liskAPIClient, address, limit, offset, filter, customFilters,
    })
      .then((transactionsResponse) => {
        dispatch({
          data: {
            address,
            transactions: transactionsResponse.data,
            count: parseInt(transactionsResponse.meta.count, 10),
            filter,
            customFilters,
          },
          type: actionTypes.searchMoreTransactions,
        });
        dispatch(loadingFinished(actionTypes.searchMoreTransactions));
      });
  };

export const searchSuggestions = ({ searchTerm }) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    dispatch({
      data: {},
      type: actionTypes.searchClearSuggestions,
    });
    searchAll({ liskAPIClient, searchTerm }).then(response => dispatch({
      data: response,
      type: actionTypes.searchSuggestions,
    }));
  };
