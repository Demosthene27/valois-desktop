/* eslint-disable max-lines */
// TODO figure out how to reduce size of this file
import i18next from 'i18next';
import actionTypes from '../constants/actions';
import { getAccount, setSecondPassphrase } from '../utils/api/account';
import { registerDelegate, getDelegate, getAllVotes, getVoters } from '../utils/api/delegate';
import { getTransactions } from '../utils/api/transactions';
import { getBlocks } from '../utils/api/blocks';
import { loadTransactionsFinish, transactionsUpdated } from './transactions';
import { delegateRegisteredFailure } from './delegate';
import { secondPassphraseRegisteredFailure } from './secondPassphrase';
import { liskAPIClientUpdate } from './peers';
import { getTimeOffset } from '../utils/hacks';
import Fees from '../constants/fees';
import transactionTypes from '../constants/transactionTypes';
import { updateWallet } from './wallets';
import { extractAddress, extractPublicKey } from '../utils/account';
import accountConfig from '../constants/account';
import { loginType } from '../constants/hwConstants';
import { errorToastDisplayed } from './toaster';
import { tokenMap } from '../constants/tokens';

/**
 * Trigger this action to remove passphrase from account object
 *
 * @param {Object} data - account data
 * @returns {Object} - Action object
 */
export const removePassphrase = data => ({
  data,
  type: actionTypes.removePassphrase,
});

/**
 * Trigger this action to update the account object
 * while already logged in
 *
 * @param {Object} data - account data
 * @returns {Object} - Action object
 */
export const accountUpdated = data => ({
  data,
  type: actionTypes.accountUpdated,
});

/**
 * Trigger this action to log out of the account
 * while already logged in
 *
 * @returns {Object} - Action object
 */
export const accountLoggedOut = () => ({
  type: actionTypes.accountLoggedOut,
});

/**
 * Trigger this action to login to an account
 * The login middleware triggers this action
 *
 * @param {Object} data - account data
 * @returns {Object} - Action object
 */
export const accountLoggedIn = data => ({
  type: actionTypes.accountLoggedIn,
  data,
});

export const accountLoading = () => ({
  type: actionTypes.accountLoading,
});

export const passphraseUsed = data => ({
  type: actionTypes.passphraseUsed,
  data,
});

export const delegateStatsLoaded = data => ({
  type: actionTypes.delegateStatsLoaded,
  data,
});

/**
 * Gets list of all votes
 */
export const accountVotesFetched = ({ address }) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    return getAllVotes(liskAPIClient, address).then(({ data }) => {
      dispatch({
        type: actionTypes.accountAddVotes,
        votes: data.votes,
      });
    });
  };

/**
 * Gets list of all voters
 */
export const accountVotersFetched = ({ publicKey }) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    return getVoters(liskAPIClient, { publicKey }).then(({ data }) => {
      dispatch({
        type: actionTypes.accountAddVoters,
        voters: data,
      });
    });
  };
/**
 *
 */
export const secondPassphraseRegistered = ({ secondPassphrase, account, passphrase }) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    const timeOffset = getTimeOffset(getState());
    setSecondPassphrase(liskAPIClient, secondPassphrase, account.publicKey, passphrase, timeOffset)
      .then((data) => {
        dispatch({
          data: {
            id: data.id,
            senderPublicKey: account.publicKey,
            senderId: account.address,
            amount: 0,
            fee: Fees.setSecondPassphrase,
            type: transactionTypes.setSecondPassphrase,
          },
          type: actionTypes.transactionAdded,
        });
      }).catch((error) => {
        const text = (error && error.message) ? error.message : i18next.t('An error occurred while registering your second passphrase. Please try again.');
        dispatch(secondPassphraseRegisteredFailure({ text }));
      });
    dispatch(passphraseUsed(passphrase));
  };

export const updateDelegateAccount = ({ publicKey }) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    return getDelegate(liskAPIClient, { publicKey })
      .then((response) => {
        dispatch(accountUpdated(Object.assign(
          {},
          { delegate: response.data[0], isDelegate: true },
        )));
      });
  };

/**
 *
 */
export const delegateRegistered = ({
  account, passphrase, username, secondPassphrase,
}) =>
  (dispatch, getState) => {
    const timeOffset = getTimeOffset(getState());
    const liskAPIClient = getState().peers.liskAPIClient;
    registerDelegate(liskAPIClient, username, passphrase, secondPassphrase, timeOffset)
      .then((data) => {
        // dispatch to add to pending transaction
        dispatch({
          data: {
            id: data.id,
            senderPublicKey: account.publicKey,
            senderId: account.address,
            username,
            amount: 0,
            fee: Fees.registerDelegate,
            type: transactionTypes.registerDelegate,
          },
          type: actionTypes.transactionAdded,
        });
      })
      .catch((error) => {
        dispatch(delegateRegisteredFailure(error));
      });
    dispatch(passphraseUsed(passphrase));
  };

export const loadDelegate = ({ publicKey }) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    getDelegate(liskAPIClient, { publicKey }).then((response) => {
      dispatch({
        data: {
          delegate: response.delegate,
        },
        type: actionTypes.updateDelegate,
      });
    });
  };

export const loadAccount = ({
  address,
  transactionsResponse,
  isSameAccount,
}) =>
  (dispatch, getState) => {
    const networkConfig = getState().network;
    getAccount({ networkConfig, address })
      .then((response) => {
        let accountDataUpdated = {
          confirmed: transactionsResponse.data,
          count: parseInt(transactionsResponse.meta.count, 10),
          balance: response.balance,
          address,
        };

        if (!isSameAccount && response.publicKey) {
          dispatch(loadDelegate({
            publicKey: response.publicKey,
          }));
        } else if (isSameAccount && response.delegate && response.delegate.username) {
          accountDataUpdated = {
            ...accountDataUpdated,
            delegate: response.delegate,
          };
        }
        dispatch(loadTransactionsFinish(accountDataUpdated));
      });
  };

export const updateTransactionsIfNeeded = ({ transactions, account }, windowFocus) =>
  (dispatch) => {
    const hasRecentTransactions = txs => (
      txs.confirmed.filter(tx => tx.confirmations < 1000).length !== 0 ||
      txs.pending.length !== 0
    );

    if (windowFocus || hasRecentTransactions(transactions)) {
      const { filter, customFilters } = transactions;
      const address = transactions.account ? transactions.account.address : account.address;

      dispatch(transactionsUpdated({
        pendingTransactions: transactions.pending,
        address,
        limit: 25,
        filter,
        customFilters,
      }));
    }
  };

export const accountDataUpdated = ({
  account, windowIsFocused, transactions,
}) =>
  (dispatch, getState) => {
    const networkConfig = getState().network;
    getAccount({ networkConfig, address: account.address }).then((result) => {
      if (result.balance !== account.balance) {
        dispatch(updateTransactionsIfNeeded(
          {
            transactions,
            account,
          },
          !windowIsFocused,
        ));
      }
      dispatch(accountUpdated(result));
      dispatch(updateWallet(result, getState().peers));
      dispatch(liskAPIClientUpdate({ online: true }));
    }).catch((res) => {
      dispatch(liskAPIClientUpdate({ online: false, code: res.error.code }));
    });
  };

export const updateAccountDelegateStats = account =>
  async (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    const { address, publicKey } = account;
    const networkConfig = getState().network;
    const transaction = await getTransactions({
      networkConfig, address, limit: 1, type: transactionTypes.registerDelegate,
    });
    const block = await getBlocks(liskAPIClient, { generatorPublicKey: publicKey, limit: 1 });
    dispatch(delegateStatsLoaded({
      lastBlock: (block.data[0] && block.data[0].timestamp) || '-',
      txDelegateRegister: transaction.data[0],
    }));
  };


// TODO remove the export once peers actions are removed
export const connectionErrorToast = error => (
  errorToastDisplayed({
    label: error && error.message ?
      i18next.t(`Unable to connect to the node, Error: ${error.message}`) :
      i18next.t('Unable to connect to the node, no response from the server.'),
  })
);

export const login = data => async (dispatch, getState) => {
  if (data.passphrase || data.hwInfo) {
    const { passphrase } = data;
    const publicKey = passphrase ? extractPublicKey(passphrase) : data.publicKey;
    const networkConfig = getState().network;
    const address = extractAddress(publicKey);
    const accountBasics = {
      passphrase,
      publicKey,
      loginType: data.hwInfo ? loginType.ledger : loginType.normal,
      hwInfo: data.hwInfo ? data.hwInfo : {},
    };

    dispatch(accountLoading());

    await getAccount({ token: tokenMap.LSK.key, networkConfig, address }).then((accountData) => {
      const duration = (passphrase && getState().settings.autoLog) ?
        Date.now() + accountConfig.lockDuration : 0;
      const updatedAccount = {
        ...accountData,
        ...accountBasics,
        expireTime: duration,
      };

      dispatch(accountLoggedIn(updatedAccount));
    }).catch((error) => {
      dispatch(connectionErrorToast(error));
      dispatch(accountLoggedOut());
    });
  }
};
