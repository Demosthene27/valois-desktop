import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../../i18n';
import TransactionStatus from './transactionStatus';

describe('TransactionStatus', () => {
  let wrapper;

  const store = configureMockStore([thunk])({
    history: {
      location: {
        path: '/wallet/send/send',
        search: '?recipient=16313739661670634666L&amount=10&reference=test',
      },
      push: jest.fn(),
    },
    transactions: {
      failed: undefined,
    },
    bookmarks: {
      LSK: [],
    },
  });

  const options = {
    context: { i18n, store },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
    },
  };

  const props = {
    t: v => v,
    finalCallback: jest.fn(),
    failedTransactions: undefined,
    transactionFailedClear: jest.fn(),
    bookmarks: {
      LSK: [],
    },
    prevStep: jest.fn(),
    fields: {
      recipient: {
        address: '123123L',
      },
      amount: {
        value: 1,
      },
      reference: {
        value: 1,
      },
      isLoading: false,
      isHardwareWalletConnected: false,
    },
    resetTransactionResult: jest.fn(),
    transactionBroadcasted: jest.fn(),
    transactions: {
      transactionsCreated: [],
      transactionsCreatedFailed: [],
      broadcastedTransactionsError: [],
    },
    recipientAccount: {
      data: {},
      loadData: jest.fn(),
    },
  };

  beforeEach(() => {
    wrapper = mount(<TransactionStatus {...props} />, options);
  });

  it('should render properly transactionStatus', () => {
    expect(wrapper).toContainMatchingElement('.transaction-status');
  });

  it('should call finalCallback function', () => {
    wrapper.find('.on-goToWallet').at(0).simulate('click');
    wrapper.update();
    expect(props.finalCallback).toBeCalled();
  });

  it('should show dropdown bookmark', () => {
    expect(wrapper).toContainMatchingElement('.bookmark-container');
    expect(wrapper).toContainMatchingElement('.bookmark-btn');
    expect(wrapper.find('.bookmark-btn').at(0).text()).toEqual('Add address to bookmarks');
    wrapper.find('.bookmark-btn').at(0).simulate('click');
    wrapper.find('input[name="accountName"]').simulate('change', { target: { name: 'accountName', value: 'ABC' } });
    wrapper.find('button').last().simulate('click');
    wrapper.setProps({
      ...props,
      bookmarks: {
        LSK: [{
          address: '123123L',
        }],
      },
    });
    wrapper.update();
    expect(wrapper.find('.bookmark-btn').at(0).text()).toEqual('Bookmarked');
    wrapper.find('.bookmark-btn').at(0).simulate('click');
  });

  it('should render error message in case of transaction failed', () => {
    const newProps = { ...props };
    newProps.transactions.broadcastedTransactionsError = [{ recipient: '123L', amount: 1, reference: 'test' }];
    wrapper = mount(<TransactionStatus {...newProps} />, options);
    expect(wrapper).toContainMatchingElement('.report-error-link');
    wrapper.find('.on-goToWallet').at(0).simulate('click');
    wrapper.update();
    expect(props.finalCallback).toBeCalled();
  });

  it('should call onPrevStep function on hwWallet', () => {
    const newProps = { ...props };
    newProps.fields.isHardwareWalletConnected = true;
    newProps.fields.hwTransactionStatus = 'error';
    newProps.failedTransactions = [{
      error: { message: 'errorMessage' },
      transaction: { recipient: '123L', amount: 1, reference: 'test' },
    }];
    wrapper = mount(<TransactionStatus {...newProps} />, options);
    expect(wrapper).toContainMatchingElement('.report-error-link');
    wrapper.find('.retry').at(0).simulate('click');
    expect(props.prevStep).toBeCalled();
  });

  it('should call broadcast function again in retry', () => {
    const newProps = { ...props };
    newProps.transactions = {
      broadcastedTransactionsError: [{
        error: { message: 'errorMessage' },
        transaction: { recipient: '123L', amount: 1, reference: 'test' },
      }],
      transactionsCreated: [{ id: 1 }],
      transactionsCreatedFailed: [{ id: 2 }],
    };

    wrapper = mount(<TransactionStatus {...newProps} />, options);
    expect(wrapper).toContainMatchingElement('.report-error-link');
    wrapper.find('.retry').at(0).simulate('click');
    expect(props.transactionBroadcasted).toBeCalled();
  });
});
