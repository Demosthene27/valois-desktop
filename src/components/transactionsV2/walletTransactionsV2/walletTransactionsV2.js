import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SecondaryButtonV2 } from '../../toolbox/buttons/button';
import localJSONStorage from '../../../utils/localJSONStorage';
import TransactionsOverviewV2 from '../transactionsOverviewV2';
import txFilters from '../../../constants/transactionFilters';
import Banner from '../../toolbox/banner/banner';
import TransactionsOverviewHeader from '../transactionsOverviewHeader/transactionsOverviewHeader';
import routes from '../../../constants/routes';
import styles from './walletTransactionsV2.css';

class WalletTransactionsV2 extends React.Component {
  // eslint-disable-next-line max-statements
  constructor() {
    super();

    this.state = {
      filter: {},
      customFilters: {},
      copied: false,
      closedOnboarding: false,
    };

    this.copyTimeout = null;

    this.saveFilters = this.saveFilters.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.clearAllFilters = this.clearAllFilters.bind(this);
    this.changeFilters = this.changeFilters.bind(this);
    this.onInit = this.onInit.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
    this.onFilterSet = this.onFilterSet.bind(this);
    this.onTransactionRowClick = this.onTransactionRowClick.bind(this);
    this.onCopy = this.onCopy.bind(this);
    this.closeOnboarding = this.closeOnboarding.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(this.copyTimeout);
  }

  onInit() {
    this.props.transactionsFilterSet({
      address: this.props.account.address,
      limit: 30,
      filter: txFilters.all,
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
    this.setState({ filter });
    if (filter <= 2) {
      this.props.transactionsFilterSet({
        address: this.props.address,
        limit: 30,
        filter,
        customFilters: this.state.customFilters,
      });
    } else {
      this.props.addFilter({
        filterName: 'wallet',
        value: filter,
        customFilters: this.state.customFilters,
      });
    }
  }

  onTransactionRowClick(props) {
    const transactionPath = `${routes.transactions.pathPrefix}${routes.transactions.path}/${props.value.id}`;
    this.props.history.push(transactionPath);
  }

  /* istanbul ignore next */
  saveFilters(customFilters) {
    this.props.transactionsFilterSet({
      address: this.props.address,
      limit: 25,
      filter: this.props.activeFilter,
      customFilters,
    });
    this.setState({ customFilters });
  }

  /* istanbul ignore next */
  clearFilter(filterName) {
    this.saveFilters({
      ...this.state.customFilters,
      [filterName]: '',
    });
  }

  /* istanbul ignore next */
  clearAllFilters() {
    this.saveFilters({});
  }

  /* istanbul ignore next */
  changeFilters(name, value) {
    this.setState({ customFilters: { ...this.state.customFilters, [name]: value } });
  }

  onCopy() {
    clearTimeout(this.copyTimeout);
    this.setState({
      copied: true,
    });

    this.copyTimeout = setTimeout(() =>
      this.setState({
        copied: false,
      }), 3000);
  }

  closeOnboarding() {
    localJSONStorage.set('closedWalletOnboarding', 'true');
    this.setState({ closedOnboarding: true });
  }

  render() {
    const overviewProps = {
      ...this.props,
      canLoadMore: this.props.transactions.length < this.props.count,
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

    const { t, account } = this.props;

    return (
      <React.Fragment>
        <TransactionsOverviewHeader
          followedAccounts={this.props.followedAccounts}
          address={this.props.address}
          match={this.props.match}
          t={t}
          account={account}
        />
        { account.balance === 0 && localJSONStorage.get('closedWalletOnboarding') !== 'true' ?
          <Banner
            className={`${styles.onboarding} wallet-onboarding`}
            onClose={this.closeOnboarding}
            title={t('Add some LSK to your Lisk Hub account now!')}
            footer={(
              <div className={styles.copyAddress}>
                <span className={styles.address}>{account.address}</span>
                <CopyToClipboard
                  text={account.address}
                  onCopy={this.onCopy}>
                    <SecondaryButtonV2 disabled={this.state.copied}>
                      <span>{this.state.copied ? t('Copied') : t('Copy')}</span>
                    </SecondaryButtonV2>
                </CopyToClipboard>
              </div>
            )}>
            <p>{t('You can find the LSK token on all of the worlds top exchanges and send them to your unique Lisk address:')}</p>
          </Banner> : null
        }
        <TransactionsOverviewV2 {...overviewProps} />
      </React.Fragment>
    );
  }
}

export default WalletTransactionsV2;
