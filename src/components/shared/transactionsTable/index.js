import { withTranslation } from 'react-i18next';
import React from 'react';
import Box from '../../toolbox/box';
import BoxContent from '../../toolbox/box/content';
import BoxHeader from '../../toolbox/box/header';
import FilterBar from '../filterBar';
import FilterDropdownButton from '../filterDropdownButton';
import LoadLatestButton from '../loadLatestButton';
import Table from '../../toolbox/list';
import styles from './transactionsTable.css';
import withFilters from '../../../utils/withFilters';
import withResizeValues from '../../../utils/withResizeValues';
import TransactionRow from './transactionRow';
import header from './tableHeader';

const TransactionsTable = ({
  title,
  transactions,
  isLoadMoreEnabled,
  t,
  fields,
  filters,
  applyFilters,
  clearFilter,
  clearAllFilters,
  changeSort,
  sort,
}) => {
  const handleLoadMore = () => {
    transactions.loadData(Object.keys(filters).reduce((acc, key) => ({
      ...acc,
      ...(filters[key] && { [key]: filters[key] }),
    }), {
      offset: transactions.data.length,
      sort,
    }));
  };

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
      <BoxContent className={styles.content}>
        <Table
          data={transactions.data}
          isLoading={transactions.isLoading}
          row={props => <TransactionRow t={t} {...props} />}
          loadData={handleLoadMore}
          header={header(changeSort)}
          currentSort={sort}
        />
      </BoxContent>
    </Box>
  );
};

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
