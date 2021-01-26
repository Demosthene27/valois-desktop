import React from 'react';
import { compose } from 'redux';
import withLocalSort from '../../../../../utils/withLocalSort';
import Table from '../../../../toolbox/table';
import DelegateRow from './delegateRow';
import header from './tableHeader';

const TableWrapper = compose(
  withLocalSort('delegates', 'rank:asc', {
    forgingTime: (a, b, direction) => {
      if (!a.forgingTime) return 1;
      if (!b.forgingTime) return -1;
      return ((a.forgingTime.time > b.forgingTime.time) ? 1 : -1) * (direction === 'asc' ? 1 : -1);
    },
  }),
)(({
  delegates, handleLoadMore, t, activeTab,
  changeSort, sort, canLoadMore,
}) => (
  <Table
    data={delegates.data}
    isLoading={delegates.isLoading}
    row={DelegateRow}
    loadData={handleLoadMore}
    additionalRowProps={{
      t,
      activeTab,
    }}
    header={header(activeTab, changeSort, t)}
    currentSort={sort}
    canLoadMore={canLoadMore}
  />
));

const filterDelegates = (delegates, filters) => ({
  ...delegates,
  data: filters.search
    ? delegates.data.filter(delegate => delegate.username.includes(filters.search))
    : delegates.data,
});

const DelegatesTable = ({
  standByDelegates,
  changeSort,
  delegates,
  filters,
  sort,
  t,
  activeTab,
}) => {
  const handleLoadMore = () => {
    delegates.loadData(Object.keys(filters).reduce((acc, key) => ({
      ...acc,
      ...(filters[key] && { [key]: filters[key] }),
    }), {
      offset: standByDelegates.meta.count + standByDelegates.meta.offset,
    }));
  };

  const canLoadMore = activeTab === 'active' || !standByDelegates.meta
    ? false
    : standByDelegates.data.length < (standByDelegates.meta.total - standByDelegates.meta.offset);

  delegates = activeTab === 'active'
    ? filterDelegates(delegates, filters)
    : filterDelegates(standByDelegates, filters);

  return (
    <TableWrapper
      delegates={delegates}
      handleLoadMore={handleLoadMore}
      t={t}
      activeTab={activeTab}
      changeSort={changeSort}
      sort={sort}
      canLoadMore={canLoadMore}
    />
  );
};

export default DelegatesTable;
