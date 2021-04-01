/* eslint-disable max-lines */
import { transactions } from '@liskhq/lisk-client';

import {
  tokenMap,
  MODULE_ASSETS_NAME_ID_MAP,
  minFeePerByte,
  DEFAULT_NUMBER_OF_SIGNATURES,
  DEFAULT_SIGNATURE_BYTE_SIZE,
  MODULE_ASSETS_MAP,
  moduleAssetSchemas,
} from '@constants';
import { extractAddress } from '@utils/account';

import http from '../http';
import ws from '../ws';
import { getDelegates } from '../delegate';
import regex from '../../regex';
import { validateAddress } from '../../validators';

const httpPrefix = '/api/v2';

const httpPaths = {
  fees: `${httpPrefix}/fees`,
  transactions: `${httpPrefix}/transactions`,
  transaction: `${httpPrefix}/transactions`,
  transactionStats: `${httpPrefix}/transactions/statistics`,
  schemas: `${httpPrefix}/transactions/schemas`,
};

const wsMethods = {
  transactions: 'get.transactions',
};

/**
 * Retrieves the details of a single transaction
 *
 * @param {Object} data
 * @param {String} data.params
 * @param {String} data.params.id - Id of the transaction
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} Transaction details API call
 */
export const getTransaction = ({
  params, network, baseUrl,
}) => http({
  path: httpPaths.transaction,
  params,
  network,
  baseUrl,
});

const filters = {
  address: { key: 'address', test: address => !validateAddress(tokenMap.LSK.key, address) },
  timestamp: { key: 'timestamp', test: str => /\d+:\d+/.test(str) },
  amount: { key: 'amount', test: str => /\d+:\d+/.test(str) },
  limit: { key: 'limit', test: num => parseInt(num, 10) > 0 },
  offset: { key: 'offset', test: num => parseInt(num, 10) >= 0 },
  moduleAssetId: { key: 'moduleAssetId', test: str => /\d:\d/.test(str) },
  height: { key: 'height', test: num => parseInt(num, 10) > 0 },
  sort: {
    key: 'sort',
    test: str => ['amount:asc', 'amount:desc', 'fee:asc', 'fee:desc', 'type:asc', 'type:desc', 'timestamp:asc', 'timestamp:desc'].includes(str),
  },
};

/**
 * Retrieves the list of transactions for given parameters
 *
 * @param {Object} data
 * @param {Object} data.network - Network setting from Redux store
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.params
 * @param {String} data.params.address Sender or recipient account
 * @param {String} data.params.dateFrom Unix timestamp, the start time of txs
 * @param {String} data.params.dateTo Unix timestamp, the end time of txs
 * @param {String} data.params.amountFrom The minimum value of txs
 * @param {String} data.params.amountTo The maximum value of txs
 * @param {Number} data.params.type The title of the transaction type
 * @param {Number} data.params.offset Used for pagination
 * @param {Number} data.params.limit Used for pagination
 * @param {String} data.params.sort an option of 'amount:asc',
 * 'amount:desc', 'timestamp:asc', 'timestamp:desc',
 * @param {Object} data.params.height The height of the block whose transaction we want.
 * If passed, all other parameter will be ignored.
 * @returns {Promise} Transactions list API call
 */
export const getTransactions = ({
  network,
  params,
  baseUrl,
}) => {
  const typeConfig = params.type && MODULE_ASSETS_NAME_ID_MAP[params.type];

  // if type, correct the type and use WS
  if (typeConfig) {
    const requests = Object.values(typeConfig.code).map(type => ({
      method: wsMethods.transactions,
      params: { type },
    }));
    // BaseUrl is only used for retrieving archived txs, so it's not needed here.
    return ws({ baseUrl: network.serviceUrl, requests });
  }

  const normParams = {};

  // if blockId, ignore others
  if (params.blockId) {
    normParams.block = params.blockId;
  } else {
    // Validate params and fix keys
    Object.keys(params).forEach((key) => {
      if (filters[key] && filters[key].test(params[key])) {
        normParams[filters[key].key] = params[key];
      } else {
        // eslint-disable-next-line no-console
        console.log(`getTransactions: Dropped ${key} parameter, it's invalid.`, params[key]);
      }
    });
  }

  return http({
    network,
    path: httpPaths.transactions,
    params: normParams,
    baseUrl,
  });
};

// @todo document this function signature
export const getRegisteredDelegates = async ({ network }) => {
  const delegates = await getDelegates({
    network,
    params: { limit: 1 },
  });
  const responseTransactions = await getTransactions({
    network,
    params: { moduleAssetId: '5:0', limit: 100 },
  });

  if (delegates.error || responseTransactions.error) {
    return Error('Error fetching data.');
  }

  // get number of registration in each month
  const monthStats = responseTransactions.data
    .map((tx) => {
      const date = new Date(tx.timestamp * 1000);
      return `${date.getFullYear()}-${date.getMonth() + 1}`;
    }).reduce((acc, date) => {
      if (typeof acc[date] !== 'number') acc[date] = 1;
      else acc[date] += 1;
      return acc;
    }, {});


  // start with [total delegates number]
  // subtract total of each month to get prev month's stats
  return Object.values(monthStats).reduce((acc, item) => {
    acc.unshift(acc[0] - item);
    return acc;
  }, [delegates.meta.total]);
};

/**
 * Retrieves the overall statistics of network transactions.
 *
 * @param {Object} data
 * @param {Object} data.params
 * @param {String} data.params.period - An option of 'day' or 'month'
 * @param {Number} data.params.limit - The number of results
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Object} Network transactions statistics
 */
export const getTransactionStats = ({ network, params: { period } }) => {
  const normParams = {
    week: { path: 'day', limit: 7 },
    month: { path: 'month', limit: 6 },
    year: { path: 'month', limit: 12 },
  };

  return http({
    path: `${httpPaths.transactionStats}/${normParams[period].path}`,
    params: { limit: normParams[period].limit },
    network,
  });
};

/**
 * Gets the amount of a given transaction
 *
 * @param {Object} transaction The transaction object
 * @returns {String} Amount in Beddows/Satoshi
 */
export const getTxAmount = ({ moduleAssetId, asset }) => {
  if (moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.transfer) {
    return asset.amount;
  }

  if (moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.unlockToken) {
    return asset.unlockingObjects.reduce((sum, unlockingObject) =>
      sum + parseInt(unlockingObject.amount, 10), 0);
  }
  if (moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.voteDelegate) {
    return asset.votes.reduce((sum, vote) =>
      sum + parseInt(vote.amount, 10), 0);
  }

  return undefined;
};

const splitModuleAndAssetIds = (moduleAssetId) => {
  const [moduleID, assetID] = moduleAssetId.split(':');
  return [Number(moduleID), Number(assetID)];
};

// eslint-disable-next-line max-statements
const createTransactionObject = (tx, moduleAssetId) => {
  const [moduleID, assetID] = splitModuleAndAssetIds(moduleAssetId);
  const {
    senderPublicKey, nonce, amount, recipientAddress, data, fee = 0,
  } = tx;

  const transaction = {
    moduleID,
    assetID,
    senderPublicKey: Buffer.from(senderPublicKey, 'hex'),
    nonce: BigInt(nonce),
    fee: BigInt(fee),
    signatures: [],
  };

  if (moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.transfer) {
    transaction.asset = {
      recipientAddress: extractAddress(recipientAddress),
      amount: BigInt(amount),
      data,
    };
  } else if (moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.voteDelegate) {
    transaction.asset = {
      votes: tx.votes,
    };
  } else if (moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.unlockToken) {
    transaction.asset = {
      unlockObjects: tx.unlockObjects,
    };
  } else if (moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.registerDelegate) {
    transaction.asset = {
      username: tx.username,
    };
  } else if (moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup) {
    transaction.asset = {
      numberOfSignatures: tx.numberOfSignatures,
      mandatoryKeys: tx.mandatoryKeys,
      optionalKeys: tx.optionalKeys,
    };
  } else {
    throw Error('Unknown transaction');
  }

  return transaction;
};

/**
 * creates a new transaction
 *
 * @param {Object} transaction The transaction information
 * @param {String} transactionType The transaction type title
 * @returns {Promise} promise that resolves to a transaction or
 * rejects with an error
 */
export const create = ({
  network,
  moduleAssetId,
  ...transactionObject
// eslint-disable-next-line max-statements
}) => new Promise((resolve, reject) => {
  const { networkIdentifier } = network.networks.LSK;
  const {
    passphrase, ...rawTransaction
  } = transactionObject;

  const schema = moduleAssetSchemas[moduleAssetId];
  const transaction = createTransactionObject(rawTransaction, moduleAssetId);

  try {
    const signedTransaction = transactions.signTransaction(
      schema, transaction, Buffer.from(networkIdentifier, 'hex'), passphrase,
    );
    resolve(signedTransaction);
  } catch (error) {
    reject(error);
  }
});

/**
 * broadcasts a transaction over the network
 *
 * @param {object} transaction
 * @param {Object} network
 * @param {string} network.name - the network name, e.g. mainnet, betanet
 * @param {string} network.address - the node address e.g. https://betanet-lisk.io
 * @returns {Promise} promise that resolves to a transaction or rejects with an error
 */
export const broadcast = ({ transaction, serviceUrl }) => {
  const schema = moduleAssetSchemas[transaction.moduleAssetId];
  const binary = transactions.getBytes(schema, transaction);
  const payload = binary.toString('hex');

  return new Promise(
    async (resolve, reject) => {
      try {
        const response = await http({
          method: 'POST',
          baseUrl: serviceUrl,
          path: '/api/v2/transactions',
          body: { transaction: payload },
        });

        resolve(response);
      } catch (error) {
        reject(error);
      }
    },
  );
};

/**
 * Returns a dictionary of base fees for low, medium and high processing speeds
 *
 * @todo The current implementation mocks the results with realistic values.
 * We will refactor this function to fetch the base fees from Lisk Service
 * when the endpoint is ready. Refer to #3081
 *
 * @returns {Promise<{Low: number, Medium: number, High: number}>} with low,
 * medium and high priority fee options
 */
export const getTransactionBaseFees = network =>
  http({
    path: httpPaths.fees,
    searchParams: {},
    network,
  })
    .then((response) => {
      const { feeEstimatePerByte } = response.data;
      return {
        Low: feeEstimatePerByte.low,
        Medium: feeEstimatePerByte.medium,
        High: feeEstimatePerByte.high,
      };
    });

/**
 * Returns the actual tx fee based on given tx details
 * and selected processing speed
 *
 * @param {String} txData - The transaction object
 * @param {Object} selectedPriority - network configuration
 * @returns {Promise} Object containing value, error and feedback
 */
// eslint-disable-next-line max-statements
export const getTransactionFee = async ({
  transaction, selectedPriority,
}) => {
  const numberOfSignatures = DEFAULT_NUMBER_OF_SIGNATURES;
  const feePerByte = selectedPriority.value;
  const {
    moduleAssetId, ...rawTransaction
  } = transaction;

  const schema = moduleAssetSchemas[moduleAssetId];
  const maxAssetFee = MODULE_ASSETS_MAP[moduleAssetId].maxFee;

  const transactionObject = createTransactionObject(rawTransaction, moduleAssetId);

  const minFee = transactions.computeMinFee(schema, {
    ...transactionObject,
    signatures: undefined,
  });

  // tie breaker is only meant for medium and high processing speeds
  const tieBreaker = selectedPriority.selectedIndex === 0
    ? 0 : minFeePerByte * feePerByte * Math.random();

  const size = transactions.getBytes(schema, {
    ...transactionObject,
    signatures: new Array(numberOfSignatures).fill(
      Buffer.alloc(DEFAULT_SIGNATURE_BYTE_SIZE),
    ),
  }).length;

  let fee = minFee + BigInt(size * feePerByte) + BigInt(tieBreaker);

  const maxFee = BigInt(maxAssetFee);
  if (fee > maxFee) {
    fee = maxFee;
  }

  const roundedValue = transactions.convertBeddowsToLSK(fee.toString());

  const feedback = transaction.amount === ''
    ? '-'
    : `${(roundedValue ? '' : 'Invalid amount')}`;

  return {
    value: roundedValue,
    error: !!feedback,
    feedback,
  };
};

export const getTokenFromAddress = address => (
  regex.address.test(address) ? tokenMap.LSK.key : tokenMap.BTC.key
);

/**
 * Retrieves transaction schemas.
 *
 * @param {Object} data
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} http call
 */
export const getSchemas = ({ baseUrl }) => http({
  path: httpPaths.schemas,
  baseUrl,
});
