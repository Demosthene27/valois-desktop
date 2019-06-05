import i18next from 'i18next';
import Lisk from '@liskhq/lisk-client';
import { loginType } from '../../constants/hwConstants';
import { voteWithHW } from '../../utils/api/hwWallet';

// TODO remove listAccountDelegates and use getVotes defined below
export const listAccountDelegates = (liskAPIClient, address) =>
  liskAPIClient.votes.get({ address, limit: '101' });

export const listDelegates = (liskAPIClient, options) => (
  liskAPIClient.delegates.get(options)
);

// TODO remove getDelegate and use listDelegates defined above
export const getDelegate = (liskAPIClient, options) =>
  liskAPIClient.delegates.get(options);


export const splitVotesIntoRounds = ({ votes, unvotes }) => {
  const rounds = [];
  const maxCountOfVotesInOneTurn = 33;
  while (votes.length + unvotes.length > 0) {
    const votesLength = Math.min(
      votes.length,
      maxCountOfVotesInOneTurn - Math.min(unvotes.length, 16),
    );
    rounds.push({
      votes: votes.splice(0, votesLength),
      unvotes: unvotes.splice(0, maxCountOfVotesInOneTurn - votesLength),
    });
  }
  return rounds;
};

const voteWithPassphrase = (
  liskAPIClient,
  passphrase,
  publicKey,
  votes,
  unvotes,
  secondPassphrase,
  timeOffset,
) => (
  Promise.all(splitVotesIntoRounds({
    votes: [...votes],
    unvotes: [...unvotes],
  }).map(({ votes, unvotes }) => { // eslint-disable-line no-shadow
    const transaction = Lisk.transaction.castVotes({
      votes,
      unvotes,
      passphrase,
      secondPassphrase,
      timeOffset,
    });
    return new Promise((resolve, reject) => {
      liskAPIClient.transactions.broadcast(transaction)
        .then(() => resolve(transaction)).catch(reject);
    });
  }))
);

export const vote = async ({
  liskAPIClient,
  account,
  votedList,
  unvotedList,
  secondPassphrase,
  timeOffset,
}) => {
  switch (account.loginType) {
    case loginType.normal:
      return voteWithPassphrase(
        liskAPIClient, account.passphrase, account.publicKey,
        votedList, unvotedList, secondPassphrase, timeOffset,
      );
    case loginType.ledger:
      return voteWithHW(liskAPIClient, account, votedList, unvotedList);
    default:
      return new Promise((resolve, reject) => {
        reject(i18next.t('Login Type not recognized.'));
      });
  }
};

export const getVotes = (liskAPIClient, { address, offset, limit }) =>
  liskAPIClient.votes.get({ address, limit, offset });

export const registerDelegate = (
  liskAPIClient,
  username,
  passphrase,
  secondPassphrase = null,
  timeOffset,
) => {
  const data = { username, passphrase, timeOffset };
  if (secondPassphrase) {
    data.secondPassphrase = secondPassphrase;
  }
  return new Promise((resolve, reject) => {
    const transaction = Lisk.transaction.registerDelegate({ ...data });
    liskAPIClient.transactions
      .broadcast(transaction)
      .then(() => {
        resolve(transaction);
      })
      .catch(reject);
  });
};
