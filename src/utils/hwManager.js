// istanbul ignore file
// TODO include unit test
import to from 'await-to-js';
import i18next from 'i18next';
import {
  getPublicKey,
  signTransaction,
  subscribeToDeviceConnceted,
  subscribeToDeviceDisonnceted,
  subscribeToDevicesList,
} from '../../libs/hwManager/communication';
import { calculateTxId, createSendTX, createRawVoteTX } from './rawTransactionWrapper';
import { splitVotesIntoRounds } from './voting';

/**
 * getAccountsFromDevice - Function.
 * This function is used for retrieve the accounts from an hw device, using publick keys.
 */
const getAccountsFromDevice = async () => {
  // TODO implement logic for this function
  getPublicKey();
  throw new Error('not umplemented');
};

/**
 * signSendTransaction - Function.
 * This function is used for sign a send transaction.
 */
const signSendTransaction = async (account, data) => {
  const transactionObject = createSendTX(
    account.info.LSK.publicKey,
    data.recipientId,
    data.amount,
    data.data,
  );

  const transaction = {
    deviceId: account.hwInfo.deviceId,
    index: account.hwInfo.derivationIndex,
    tx: transactionObject,
  };

  const [error, signature] = await to(signTransaction(transaction));

  if (error) throw new Error(error);
  const signedTransaction = { ...transactionObject, signature };
  const result = { ...signedTransaction, id: calculateTxId(signedTransaction) };
  return result;
};

/**
 * signVoteTransaction - Function.
 * This function is used for sign a vote transaction.
 */
const signVoteTransaction = async (
  account,
  votedList,
  unvotedList,
) => {
  const signedTransactions = [];
  const votesChunks = splitVotesIntoRounds({ votes: [...votedList], unvotes: [...unvotedList] });

  try {
    for (let i = 0; i < votesChunks.length; i++) {
      const transactionObject = createRawVoteTX(
        account.publicKey,
        account.address,
        votesChunks[i].votes,
        votesChunks[i].unvotes,
      );

      // eslint-disable-next-line no-await-in-loop
      const signature = await signTransaction({
        deviceId: account.hwInfo.deviceId,
        index: account.hwInfo.derivationIndex,
        tx: transactionObject,
      });

      signedTransactions.push({
        ...transactionObject,
        signature,
        id: calculateTxId({ ...transactionObject, signature }),
      });
    }
    return signedTransactions;
  } catch (error) {
    return new Error(i18next.t(
      'The transaction has been canceled on your {{model}}',
      { model: account.hwInfo.deviceModel },
    ));
  }
};

export {
  getAccountsFromDevice,
  signSendTransaction,
  signVoteTransaction,
  subscribeToDeviceConnceted,
  subscribeToDeviceDisonnceted,
  subscribeToDevicesList,
};
