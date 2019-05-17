import {
  accountDataUpdated,
  updateDelegateAccount,
} from '../../actions/account'; // eslint-disable-line
import { votesFetched } from '../../actions/voting';
import {
  transactionsRequested,
  cleanTransactions,
  updateTransactionsIfNeeded,
} from '../../actions/transactions';
import actionTypes from '../../constants/actions';
import transactionTypes from '../../constants/transactionTypes';

import { getActiveTokenAccount } from '../../utils/account';
import { getAutoLogInData, shouldAutoLogIn } from '../../utils/login';
import { liskAPIClientSet, liskAPIClientUpdate } from '../../actions/peers';
import networks from '../../constants/networks';
import settings from '../../constants/settings';
import txFilters from '../../constants/transactionFilters';

import { setWalletsLastBalance } from '../../actions/wallets';
import { setWalletsInLocalStorage } from '../../utils/wallets';

const updateAccountData = (store, action) => {
  const { transactions } = store.getState();
  const account = getActiveTokenAccount(store.getState());

  store.dispatch(accountDataUpdated({
    windowIsFocused: action.data.windowIsFocused,
    transactions,
    account,
  }));

  /**
   * NOTE: dashboard transactionsList are not loaded when rendering the component,
   *  as this component just reads transactions from state.
   *  When autologin in, we need to explicitly request the transactions for that account.
   *
   *  Ignoring coverage because autologin is a development feature not accessible by end users
   */
  /* istanbul ignore if */
  if (shouldAutoLogIn(getAutoLogInData())) {
    store.dispatch(transactionsRequested({
      address: account.address,
      filter: txFilters.all,
    }));
  }
};

const getRecentTransactionOfType = (transactionsList, type) => (
  transactionsList.filter(transaction => (
    transaction.type === type &&
    // limit the number of confirmations to 5 to not fire each time there is another new transaction
    // theoretically even less then 5, but just to be on the safe side
    transaction.confirmations < 5))[0]
);

const delegateRegistration = (store, action) => {
  const delegateRegistrationTx = getRecentTransactionOfType(
    action.data.confirmed,
    transactionTypes.registerDelegate,
  );
  const state = store.getState();

  if (delegateRegistrationTx) {
    store.dispatch(updateDelegateAccount({
      publicKey: state.account.publicKey,
    }));
  }
};

const votePlaced = (store, action) => {
  const voteTransaction = getRecentTransactionOfType(action.data.confirmed, transactionTypes.vote);

  if (voteTransaction) {
    const state = store.getState();
    const { account } = state;

    store.dispatch(votesFetched({
      address: account.address,
      type: 'update',
    }));
  }
};

const checkTransactionsAndUpdateAccount = (store, action) => {
  const state = store.getState();
  const { transactions, settings: { token } } = state;
  const account = getActiveTokenAccount(store.getState());
  // Adding timeout explained in
  // https://github.com/LiskHQ/lisk-hub/pull/1609
  setTimeout(() => {
    store.dispatch(updateTransactionsIfNeeded(
      {
        transactions,
        account,
      },
      action.data.windowIsFocused,
    ));
  }, 500);

  const txs = action.data.block.transactions || [];
  const blockContainsRelevantTransaction = txs.filter((transaction) => {
    const sender = transaction ? transaction.senderId : null;
    const recipient = transaction ? transaction.recipientId : null;
    return account.address === recipient || account.address === sender;
  }).length > 0;
  const recentBtcTransaction = token.active === 'BTC' &&
    transactions.confirmed.filter(t => t.confirmations === 1).length;

  if (blockContainsRelevantTransaction || recentBtcTransaction) {
    // it was not getting the account with secondPublicKey right
    // after a new block with second passphrase registration transaction was received
    setTimeout(() => {
      updateAccountData(store, action);
    }, 500);
  }
};

const autoLogInIfNecessary = (store) => {
  const autologinData = getAutoLogInData();
  if (shouldAutoLogIn(autologinData)) {
    store.dispatch(liskAPIClientSet({
      passphrase: autologinData[settings.keys.loginKey],
      network: { ...networks.customNode, address: autologinData[settings.keys.liskCoreUrl] },
      options: {
        code: networks.customNode.code,
        address: autologinData[settings.keys.liskCoreUrl],
      },
    }));
    store.dispatch(liskAPIClientUpdate({
      online: true,
    }));
  }
};

const accountMiddleware = store => next => (action) => {
  next(action);
  switch (action.type) {
    case actionTypes.storeCreated:
      store.dispatch(setWalletsLastBalance());
      autoLogInIfNecessary(store, next, action);
      break;
    // update on login because the 'save account' button
    // depends on a rerendering of the page
    // TODO: fix the 'save account' path problem, so we can remove this
    case actionTypes.accountLoggedIn:
      store.dispatch(setWalletsLastBalance());
      updateAccountData(store, action);
      break;
    case actionTypes.newBlockCreated:
      checkTransactionsAndUpdateAccount(store, action);
      break;
    case actionTypes.transactionsUpdated:
      delegateRegistration(store, action);
      votePlaced(store, action);
      break;
    case actionTypes.accountLoggedOut:
      setWalletsInLocalStorage(store.getState().wallets);
      store.dispatch(cleanTransactions());
      localStorage.removeItem('accounts');
      localStorage.removeItem('isHarwareWalletConnected');
      break;
    /* istanbul ignore next */
    default: break;
  }
};

export default accountMiddleware;
