import to from 'await-to-js';
import i18next from 'i18next';
import {
  listAccountDelegates,
  listDelegates,
  vote,
} from '../utils/api/delegate';
import { getVotingLists, getVotingError } from '../utils/voting';
import { getTimeOffset } from '../utils/hacks';
import { updateDelegateCache } from '../utils/delegates';
import { passphraseUsed } from './account';
import { addPendingTransaction } from './transactions';
import { errorToastDisplayed } from './toaster';
import actionTypes from '../constants/actions';

/**
 * Add data to the list of all delegates
 */
// TODO remove this and use directly the actionTypes.delegatesAdded as it's used only in this file
export const delegatesAdded = data => ({
  type: actionTypes.delegatesAdded,
  data,
});

/**
 * Toggles account's vote for the given delegate
 */
export const voteToggled = data => ({
  type: actionTypes.voteToggled,
  data,
});


/**
 * Updates vote lookup status of the given delegate name
 */
export const voteLookupStatusUpdated = data => ({
  type: actionTypes.voteLookupStatusUpdated,
  data,
});

/**
 * Clears all vote lookup statuses
 */
export const voteLookupStatusCleared = () => ({
  type: actionTypes.voteLookupStatusCleared,
});

export const clearVotes = () => ({
  type: actionTypes.votesCleared,
});


// TODO adjust the utils to return errors in a consistent way so that this function can be removed
const handleVoteError = ({ error }) => {
  if (error && error.message) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  }
  return i18next.t('An error occurred while placing your vote.');
};

/**
 * Makes Api call to register votes
 * Adds pending state and then after the duration of one round
 * cleans the pending state
 */
export const votePlaced = ({
  account, votes, secondPassphrase, callback,
}) =>
  async (dispatch, getState) => { // eslint-disable-line max-statements
    const liskAPIClient = getState().peers.liskAPIClient;
    const { votedList, unvotedList } = getVotingLists(votes);
    const timeOffset = getTimeOffset(getState());

    const label = getVotingError(votes, account);
    if (label) {
      dispatch(errorToastDisplayed({ label }));
      return;
    }

    const [error, callResult] = await to(vote({
      liskAPIClient,
      account,
      votedList,
      unvotedList,
      secondPassphrase,
      timeOffset,
    }));

    if (error) {
      callback({
        success: false,
        errorMessage: error.message,
        text: handleVoteError({ error }),
      });
    } else {
      dispatch({ type: actionTypes.pendingVotesAdded });
      callResult.map(transaction => dispatch(addPendingTransaction(transaction)));
      dispatch(passphraseUsed(account.passphrase));
      callback({ success: true });
    }
  };

/**
 * Gets the list of delegates current account has voted for
 *
 */
export const votesFetched = ({ address, type }) =>
  (dispatch, getState) => {
    // TODO use getState().network instead of getState().peers and adjust
    const liskAPIClient = getState().peers.liskAPIClient;
    listAccountDelegates(liskAPIClient, address).then((response) => {
      dispatch({
        type: type === 'update' ? actionTypes.votesUpdated : actionTypes.votesAdded,
        data: { list: response.data.votes },
      });
    });
  };

/**
 * Gets list of all delegates
 */
export const delegatesFetched = ({
  offset, refresh, q, callback = () => {},
}) =>
  (dispatch, getState) => {
    // TODO use getState().network instead of getState().peers and adjust
    const liskAPIClient = getState().peers.liskAPIClient;
    let params = {
      offset,
      limit: '101',
      sort: 'rank:asc',
    };
    params = q ? { ...params, search: q } : params;
    listDelegates(liskAPIClient, params).then((response) => {
      updateDelegateCache(response.data, getState().peers);
      dispatch(delegatesAdded({
        list: response.data,
        totalDelegates: response.data.length,
        refresh,
      }));
      callback(response);
    }).catch(callback);
  };


/**
 * Get list of delegates current account has voted for and dispatch it with votes from url
 */
export const urlVotesFound = ({
  upvotes, unvotes, address,
}) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    const processUrlVotes = (votes) => {
      dispatch({
        type: actionTypes.votesAdded,
        data: { list: votes, upvotes, unvotes },
      });
    };
    listAccountDelegates(liskAPIClient, address)
      .then((response) => { processUrlVotes(response.data.votes); })
      .catch(() => { processUrlVotes([]); });
  };
