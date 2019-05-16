import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import TransactionsListV2 from './transactionsListV2';
import actionTypes from '../../constants/actions';
import txFilters from '../../constants/transactionFilters';
import i18n from '../../i18n';

describe('TransactionsList V2', () => {
  let wrapper;
  const emptyTx = [];
  const transactions = [{
    id: '11327666066806006572',
    type: 0,
    timestamp: 15647029,
    senderId: '5201600508578320196L',
    recipientId: '11950819909555235066L',
    amount: 69550000000,
    fee: 10000000,
    confirmations: 4314504,
    address: '12345678L',
    asset: {},
  }];

  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  const props = {
    followedAccounts: {
      LSK: [],
      BTC: [],
    },
    address: '',
    filter: {
      value: txFilters.incoming,
      name: 'In',
    },
    loading: [],
    transactions,
    onClick: () => {},
    loadMore: () => {},
    t: () => {},
    history: { location: { search: { id: transactions[0].id } } },
  };

  it('should render list of transactions', () => {
    wrapper = mount(<TransactionsListV2 {...props} />, options);
    expect(wrapper).to.have.descendants('.transactions-row');
  });

  it('should render only the table header and error message if transaction list is empty', () => {
    const propsNoTx = {
      ...props,
      transactions: emptyTx,
      filter: {
        value: txFilters.all,
        name: 'All',
      },
    };
    wrapper = mount(<TransactionsListV2 {...propsNoTx} />, options);
    expect(wrapper).to.have.descendants('TransactionsHeaderV2');
    expect(wrapper).to.have.descendants('.empty-message');
  });

  it('should render loading spinner', () => {
    const loadingProps = {
      ...props,
      loading: [actionTypes.transactionsFilterSet],
    };
    wrapper = mount(<TransactionsListV2 {...loadingProps} />, options);
    expect(wrapper).to.have.descendants('SpinnerV2');
  });
});
