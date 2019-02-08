import React from 'react';
import TransactionsOverviewV2 from '../transactionsOverviewV2';
import txFilters from '../../../constants/transactionFilters';
import WalletHeader from './walletHeader';
import routes from '../../../constants/routes';

class WalletTransactionsV2 extends React.Component {
  constructor() {
    super();
    this.state = {
      filter: {},
      customFilters: {},
    };
    this.saveFilters = this.saveFilters.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.clearAllFilters = this.clearAllFilters.bind(this);
    this.changeFilters = this.changeFilters.bind(this);
    this.onInit = this.onInit.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
    this.onFilterSet = this.onFilterSet.bind(this);
    this.onTransactionRowClick = this.onTransactionRowClick.bind(this);
  }

  onInit() {
    this.props.transactionsFilterSet({
      address: this.props.account.address,
      limit: 30,
      filter: txFilters.all,
    });

    this.props.searchAccount({
      address: this.props.address,
    });

    this.props.accountVotesFetched({
      address: this.props.address,
    });

    this.props.addFilter({
      filterName: 'wallet',
      value: txFilters.all,
    });
  }
  /* istanbul ignore next */
  onLoadMore() {
    this.props.transactionsRequested({
      address: this.props.address,
      limit: 30,
      offset: this.props.transactions.length,
      filter: this.props.activeFilter,
    });
  }
  /*
    Transactions from tabs are filtered based on filter number
    It applys to All, Incoming and Outgoing
    for other tabs that are not using transactions there is no need to call API
  */
  /* istanbul ignore next */
  onFilterSet(filter) {
    if (filter <= 2) {
      this.props.transactionsFilterSet({
        address: this.props.address,
        limit: 30,
        filter,
      });
    } else {
      this.props.addFilter({
        filterName: 'wallet',
        value: filter,
      });
    }
  }

  onTransactionRowClick(props) {
    const transactionPath = `${routes.transactions.pathPrefix}${routes.transactions.path}/${props.value.id}`;
    this.props.history.push(transactionPath);
  }

  render() {
    const overviewProps = {
      ...this.props,
      canLoadMore: this.props.transactions.length < this.props.transactionsCount,
      onInit: this.onInit,
      onLoadMore: this.onLoadMore,
      onFilterSet: this.onFilterSet,
      onTransactionRowClick: this.onTransactionRowClick,
      saveFilters: this.saveFilters.bind(this),
      clearFilter: this.clearFilter.bind(this),
      clearAllFilters: this.clearAllFilters.bind(this),
      changeFilters: this.changeFilters.bind(this),
      customFilters: this.state.customFilters,
    };

    return (
      <React.Fragment>
        <WalletHeader {...this.props} />
        <TransactionsOverviewV2 {...overviewProps} />
      </React.Fragment>
    );
  }
}

export default WalletTransactionsV2;
