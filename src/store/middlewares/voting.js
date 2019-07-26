<<<<<<< HEAD
import { getDelegates } from '../../utils/api/delegates';
import {
  delegatesAdded,
  loadVotes,
  voteLookupStatusUpdated,
  voteToggled,
} from '../../actions/voting';
import actionTypes from '../../constants/actions';
import { getAPIClient } from '../../utils/api/network';
import { loadDelegateCache } from '../../utils/delegates';

const updateLookupStatus = (store, list, username) => {
  store.dispatch(voteLookupStatusUpdated({
    username, status: list,
  }));
};

const lookupDelegate = (store, username) => {
  const state = store.getState();
  const liskAPIClient = getAPIClient(state.settings.token.active || 'LSK', state);
  const localStorageDelegates = loadDelegateCache(state.network);
  const delegate = localStorageDelegates[username]
    || state.voting.delegates.find(d => d.username === username);
  if (delegate) {
    return new Promise((resolve) => {
      resolve({ data: [delegate] });
    });
  }
  return getDelegates(liskAPIClient, { username });
};

const processVote = (store, options, username) => {
  updateLookupStatus(store, 'pending', username);
  lookupDelegate(store, username).then((response) => {
    const vote = store.getState().voting.votes[username];
    if (options.isValid(vote)) {
      store.dispatch(voteToggled({
        username,
        publicKey: response.data[0].account.publicKey,
        rank: response.data[0].rank,
        productivity: response.data[0].productivity,
      }));
      updateLookupStatus(store, options.successState, username);
    } else {
      updateLookupStatus(store, options.invalidState, username);
    }
  }).catch(() => {
    updateLookupStatus(store, 'notFound', username);
  });
};

const lookupDelegatesFromUrl = (store, action) => {
  const { upvotes, unvotes } = action.data;
  if (upvotes && unvotes) {
    unvotes.forEach(processVote.bind(this, store, {
      successState: 'unvotes',
      invalidState: 'notVotedYet',
      isValid: vote => (vote && vote.confirmed && vote.unconfirmed),
    }));
    upvotes.forEach(processVote.bind(this, store, {
      successState: 'upvotes',
      invalidState: 'alreadyVoted',
      isValid: vote => (!vote || (!vote.confirmed && !vote.unconfirmed)),
    }));
  }
};

const fetchVotes = (store) => {
  // TODO investigate if this function is needed here at all
  // or maybe it should be moved somewhere else (e.g. urlVotesFound action)
  const state = store.getState();
  const address = state.account.address;
  store.dispatch(loadVotes({
    address,
    type: 'update',
  }));
};
=======
import { delegatesAdded } from '../../actions/voting';
import actionTypes from '../../constants/actions';
>>>>>>> fe471010d8066b1ebb63b7f4700755426f0f4040

const votingMiddleware = store => next => (action) => {
  next(action);
  switch (action.type) {
    case actionTypes.accountLoggedOut:
      store.dispatch(delegatesAdded({ list: [] }));
      store.dispatch({
        type: actionTypes.votesAdded,
        data: { list: [] },
      });
      break;
    default: break;
  }
};

export default votingMiddleware;
