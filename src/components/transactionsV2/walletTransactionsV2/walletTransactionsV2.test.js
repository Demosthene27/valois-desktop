import React from 'react';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import { expect } from 'chai';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';
import WalletTransactionsV2 from './walletTransactionsV2';
import i18n from '../../../i18n';
import accounts from '../../../../test/constants/accounts';
import routes from '../../../constants/routes';

describe('WalletTransactions V2 Component', () => {
  let wrapper;
  let props;

  const peers = {
    data: {},
    options: {},
    liskAPIClient: {},
  };

  const transactions = [{
    id: '11327666066806006572',
    type: 0,
    timestamp: 15647029,
    senderId: '5201600508578320196L',
    recipientId: accounts.genesis.address,
    amount: 69550000000,
    fee: 10000000,
    confirmations: 4314504,
    address: '12345678L',
    asset: {},
  }];

  const store = configureMockStore([])({
    peers,
    account: accounts.genesis,
    followedAccounts: {
      accounts: [],
    },
  });

  const options = {
    context: {
      store, i18n,
    },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
  };

  beforeEach(() => {
    props = {
      account: accounts.genesis,
      match: { params: { address: accounts.genesis.address } },
      history: { push: spy(), location: { search: ' ' } },
      followedAccounts: [],
      transactionsCount: 1000,
      transactions,
      searchAccount: spy(),
      transactionsRequested: spy(),
      transactionsFilterSet: spy(),
      accountVotersFetched: spy(),
      accountVotesFetched: spy(),
      addFilter: spy(),
      t: key => key,
    };

    wrapper = mount(<Router>
        <WalletTransactionsV2 {...props} />
      </Router>, options);
  });

  it('renders WalletTransactionV2 Component and loads account transactions', () => {
    const renderedWalletTransactions = wrapper.find(WalletTransactionsV2);
    expect(renderedWalletTransactions).to.be.present();
    expect(wrapper).to.have.exactly(1).descendants('.transactions-row');
  });

  it('click on row transaction', () => {
    const transactionPath = `${routes.transactions.pathPrefix}${routes.transactions.path}/${transactions[0].id}`;
    wrapper.find('.transactions-row').first().simulate('click');
    expect(props.history.push).to.have.been.calledWith(transactionPath);
  });
});
