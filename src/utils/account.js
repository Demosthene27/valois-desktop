import Lisk from '@liskhq/lisk-client'; // eslint-disable-line

import { tokenMap } from '../constants/tokens';
import regex from './regex';

export const extractPublicKey = passphrase =>
  Lisk.cryptography.getKeys(passphrase).publicKey;

/**
 * @param {String} data - passphrase or public key
 */
export const extractAddress = (data) => {
  if (!data) {
    return false;
  }
  if (data.indexOf(' ') < 0) {
    return Lisk.cryptography.getAddressFromPublicKey(data);
  }
  return Lisk.cryptography.getAddressFromPassphrase(data);
};

export const getActiveTokenAccount = state => ({
  ...state.account,
  ...((state.account.info && state.account.info[
    state.settings.token && state.settings.token.active
      ? state.settings.token.active
      : tokenMap.LSK.key
  ]) || {}),
});

/**
 * Returns a shorter version of a given address
 * by replacing characters by ellipsis except for
 * the first and last 3.
 * @param {String} address LSk or BTC address
 * @returns {String} Truncated address
 */
export const truncateAddress = address =>
  address.replace(regex.lskAddressTrunk, '$1...$3');

export const calculateLockedBalance = ({ votes }) =>
  votes.reduce((acc, vote) => acc + vote.amount, 0);

const isBlockHeightReached = ({ unvoteHeight, delegateAddress }, currentBlockHeight, address) => {
  return true;
  // TODO reiterate this calculation
  const delayedAvailability = address === delegateAddress ? 260000 : 2000;
  return (unvoteHeight + delayedAvailability) < currentBlockHeight;
};

export const calculateAvailableAndUnlockingBalance = ({ unlocking, address }, currentBlockHeight) =>
  unlocking.reduce((acc, vote) => {
    if (isBlockHeightReached(vote, currentBlockHeight, address)) {
      acc.availableBalance += vote.amount;
    } else {
      acc.unlockingBalance += vote.amount;
    }
    return acc;
  }, { availableBalance: 0, unlockingBalance: 0 });
