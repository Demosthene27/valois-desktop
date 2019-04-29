import { toRawLsk } from '../../../utils/lsk';
import { getTimestampFromFirstBlock } from '../../datetime';
import txFilters from '../../../constants/transactionFilters';

// eslint-disable-next-line max-statements, complexity, import/prefer-default-export
export const getTransactions = ({
  liskAPIClient, address, limit = 20, offset = 0, type = undefined,
  sort = 'timestamp:desc', filter = txFilters.all, customFilters = {},
}) => {
  const params = {
    limit,
    offset,
    sort,
  };

  if (type !== undefined) params.type = type;
  if (customFilters.message) params.data = `%${customFilters.message}%`;
  if (customFilters.dateFrom && customFilters.dateFrom !== '') {
    params.fromTimestamp = getTimestampFromFirstBlock(customFilters.dateFrom, 'DD.MM.YY');
    params.fromTimestamp = params.fromTimestamp > 0 ? params.fromTimestamp : 0;
  }
  if (customFilters.dateTo && customFilters.dateTo !== '') {
    params.toTimestamp = getTimestampFromFirstBlock(customFilters.dateTo, 'DD.MM.YY', { inclusive: true });
    params.toTimestamp = params.toTimestamp > 1 ? params.toTimestamp : 1;
  }
  if (customFilters.amountFrom && customFilters.amountFrom !== '') {
    params.minAmount = toRawLsk(customFilters.amountFrom);
  }
  if (customFilters.amountTo && customFilters.amountTo !== '') {
    params.maxAmount = toRawLsk(customFilters.amountTo);
  }
  if (filter === txFilters.incoming) params.recipientId = address;
  if (filter === txFilters.outgoing) params.senderId = address;
  if (filter === txFilters.all) params.senderIdOrRecipientId = address;
  return liskAPIClient.transactions.get(params);
};
