import { withTranslation } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { DEFAULT_LIMIT } from '../../../constants/monitor';
import { DateTimeFromTimestamp } from '../../toolbox/timestamp';
import { tokenMap } from '../../../constants/tokens';
import { transactionNames } from '../../../constants/transactionTypes';
import AccountVisualWithAddress from '../accountVisualWithAddress';
import Box from '../../toolbox/box';
import BoxContent from '../../toolbox/box/content';
import BoxEmptyState from '../../toolbox/box/emptyState';
import BoxFooterButton from '../../toolbox/box/footerButton';
import BoxHeader from '../../toolbox/box/header';
import FilterBar from '../filterBar';
import FilterDropdownButton from '../filterDropdownButton';
import Icon from '../../toolbox/icon';
import Illustration from '../../toolbox/illustration';
import LiskAmount from '../liskAmount';
import LoadLatestButton from '../loadLatestButton';
import Table from '../../toolbox/table';
import Tooltip from '../../toolbox/tooltip/tooltip';
import routes from '../../../constants/routes';
import styles from './transactionsTable.css';
import withFilters from '../../../utils/withFilters';
import withResizeValues from '../../../utils/withResizeValues';

class TransactionsTable extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  handleLoadMore() {
    const { transactions, filters, sort } = this.props;

    transactions.loadData(Object.keys(filters).reduce((acc, key) => ({
      ...acc,
      ...(filters[key] && { [key]: filters[key] }),
    }), {
      offset: transactions.data.length,
      sort,
    }));
  }

  render() {
    const {
      title,
      transactions,
      isLoadMoreEnabled,
      t,
      fields,
      filters,
      emptyStateMessage,
      applyFilters,
      clearFilter,
      clearAllFilters,
      changeSort,
      sort,
      isMediumViewPort,
    } = this.props;

    const roundSize = 101;

    const formatters = {
      height: value => `${t('Height')}: ${value}`,
      type: value => `${t('Type')}: ${value}`,
      sender: value => `${t('Sender')}: ${value}`,
      recipient: value => `${t('Recipient')}: ${value}`,
    };

    return (
      <Box main isLoading={transactions.isLoading} className="transactions-box">
        <BoxHeader>
          <h1>{title}</h1>
          <FilterDropdownButton
            fields={fields}
            filters={filters}
            applyFilters={applyFilters}
          />
        </BoxHeader>
        {isLoadMoreEnabled
          && (
          <LoadLatestButton
            event="update.transactions.confirmed"
            onClick={transactions.loadData}
          >
            {t('New transactions')}
          </LoadLatestButton>
          )
        }
        <FilterBar {...{
          clearFilter, clearAllFilters, filters, formatters, t,
        }}
        />
        {transactions.error ? (
          <BoxContent>
            <BoxEmptyState>
              <Illustration name="emptyWallet" />
              <h3>{emptyStateMessage || `${transactions.error}`}</h3>
            </BoxEmptyState>
          </BoxContent>
        ) : (
          <React.Fragment>
            <BoxContent className={styles.content}>
              <Table
                getRowLink={transaction => `${routes.transactions.path}/${transaction.id}`}
                onSortChange={changeSort}
                sort={sort}
                data={transactions.data}
                columns={[
                  {
                    header: t('Sender'),
                    className: grid['col-xs-3'],
                    id: 'sender',
                    getValue: transaction => (
                      <AccountVisualWithAddress
                        address={transaction.senderId}
                        isMediumViewPort={isMediumViewPort}
                        transactionSubject="senderId"
                        transactionType={transaction.type}
                        showBookmarkedAddress
                      />
                    ),
                  },
                  {
                    header: t('Recipient'),
                    className: grid['col-xs-3'],
                    id: 'recipient',
                    getValue: transaction => (
                      <AccountVisualWithAddress
                        address={transaction.recipientId}
                        isMediumViewPort={isMediumViewPort}
                        transactionSubject="recipientId"
                        transactionType={transaction.type}
                        showBookmarkedAddress
                      />
                    ),
                  },
                  {
                    header: t('Date'),
                    className: grid['col-xs-2'],
                    id: 'timestamp',
                    isSortable: true,
                    getValue: transaction => (
                      <DateTimeFromTimestamp time={transaction.timestamp * 1000} token="BTC" />
                    ),
                  },
                  {
                    header: t('Amount'),
                    className: grid['col-xs-2'],
                    id: 'amount',
                    isSortable: true,
                    getValue: transaction => (
                      <LiskAmount val={transaction.amount} token={tokenMap.LSK.key} />
                    ),
                  },
                  {
                    header: t('Fee'),
                    className: grid['col-xs-1'],
                    id: 'fee',
                    getValue: transaction => (
                      <Tooltip
                        title={t('Transaction')}
                        className="showOnBottom"
                        tooltipClassName={`${styles.tooltip} ${styles.tooltipOffset}`}
                        content={<LiskAmount val={transaction.fee} token={tokenMap.LSK.key} />}
                        size="s"
                      >
                        <p>{`${transaction.type} - ${transactionNames(t)[transaction.type]}`}</p>
                      </Tooltip>
                    ),
                  },
                  {
                    header: t('Status'),
                    className: grid['col-xs-1'],
                    id: 'status',
                    getValue: transaction => (
                      <Tooltip
                        title={transaction.confirmations > roundSize ? t('Confirmed') : t('Pending')}
                        className="showOnLeft"
                        tooltipClassName={`${styles.tooltip} ${styles.tooltipOffset}`}
                        content={<Icon name={transaction.confirmations > roundSize ? 'approved' : 'pending'} />}
                        size="s"
                      >
                        <p>{`${transaction.confirmations}/${roundSize} ${t('Confirmations')}`}</p>
                      </Tooltip>
                    ),
                  },
                ]}
              />
            </BoxContent>
            {isLoadMoreEnabled
              && !!transactions.data.length
              && transactions.data.length % DEFAULT_LIMIT === 0 && (
              <BoxFooterButton className="load-more" onClick={this.handleLoadMore}>
                {t('Load more')}
              </BoxFooterButton>
            )}
          </React.Fragment>
        )}
      </Box>
    );
  }
}

TransactionsTable.defaultProps = {
  isLoadMoreEnabled: false,
  filters: {},
  fields: [],
};

const defaultFilters = {
  dateFrom: '',
  dateTo: '',
  message: '',
  amountFrom: '',
  amountTo: '',
  type: '',
  height: '',
  recipient: '',
  sender: '',
};

const defaultSort = 'timestamp:desc';

export default withFilters('transactions', defaultFilters, defaultSort)(
  withResizeValues(withTranslation()(TransactionsTable)),
);
