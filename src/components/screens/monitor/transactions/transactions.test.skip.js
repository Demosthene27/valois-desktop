/* eslint-disable */
import React from 'react';
import { mount } from 'enzyme';
import { TransactionsPure } from './index';
import transactions from '../../../../../test/constants/transactions';

describe('Transactions monitor page', () => {
  const props = {
    t: key => key,
    transactions: {
      data: [],
      meta: null,
      isLoading: true,
      loadData: jest.fn(),
      clearData: jest.fn(),
    },
  };
  const amountFrom = '1.3';
  const sort = 'timestamp:desc';
  const height = '1234';
  const transactionsWithData = {
    ...props.transactions,
    isLoading: false,
    data: transactions,
    meta: {
      count: transactions.length,
      offset: 0,
      total: transactions.length * 3,
    },
  };

  it.skip('should render transactions list', () => {
    const wrapper = mount(<TransactionsPure {...props} />);
    expect(wrapper.find('TransactionRow')).toHaveLength(0);
    wrapper.setProps({
      transactions: transactionsWithData,
    });
    wrapper.update();
    expect(wrapper.find('TransactionRow')).toHaveLength(transactions.length);
  });

  it.skip('allows to load more transactions', () => {
    const wrapper = mount(<TransactionsPure
      {... { ...props, transactions: transactionsWithData }}
    />);
    wrapper.find('button.load-more').simulate('click');
    expect(props.transactions.loadData).toHaveBeenCalledWith(
      { offset: transactionsWithData.data.length, sort },
    );
  });

  it.skip('shows error if API failed', () => {
    const error = 'Loading failed';
    const wrapper = mount(<TransactionsPure {...props} />);
    wrapper.setProps({
      transactions: {
        ...props.transactions,
        isLoading: false,
        error,
      },
    });
    expect(wrapper).toIncludeText(error);
  });

  it.skip('allows to load more transactions when filtered', () => {
    const wrapper = mount(<TransactionsPure
      {...{ ...props, transactions: transactionsWithData }}
    />);

    wrapper.find('button.filter').simulate('click');
    wrapper.find('input.amountFromInput').simulate('change', { target: { value: amountFrom, name: 'amountFrom' } });
    wrapper.find('form.filter-container').simulate('submit');
    wrapper.find('button.load-more').simulate('click');

    expect(props.transactions.loadData).toHaveBeenCalledWith({
      offset: transactions.length, amountFrom, sort,
    });
  });

  it.skip('allows to filter transactions by more filters', () => {
    const wrapper = mount(<TransactionsPure
      {...{ ...props, transactions: transactionsWithData }}
    />);

    wrapper.find('button.filter').simulate('click');
    wrapper.find('.more-less-switch').simulate('click');
    wrapper.find('input.height').simulate('change', { target: { value: height } });
    wrapper.find('form.filter-container').simulate('submit');
    wrapper.find('button.load-more').simulate('click');

    expect(props.transactions.loadData).toHaveBeenCalledWith({
      offset: transactions.length, height, sort,
    });
  });

  it.skip('allows to reverse sort by clicking "Date" header', () => {
    const wrapper = mount(<TransactionsPure
      {...{ ...props, transactions: transactionsWithData }}
    />);
    wrapper.find('.sort-by.timestamp').simulate('click');
    expect(props.transactions.loadData).toHaveBeenCalledWith({ sort: 'timestamp:asc' });
    wrapper.find('.sort-by.timestamp').simulate('click');
    expect(props.transactions.loadData).toHaveBeenCalledWith({ sort: 'timestamp:desc' });
  });

  it.skip('allows to clear the filter after filtering by height', () => {
    const wrapper = mount(<TransactionsPure {...props} />);
    wrapper.find('button.filter').simulate('click');
    wrapper.find('.more-less-switch').simulate('click');
    wrapper.find('input.height').simulate('change', { target: { value: height } });
    wrapper.find('form.filter-container').simulate('submit');
    wrapper.find('span.clear-filter').simulate('click');
    expect(props.transactions.loadData).toHaveBeenCalled();
  });
});
