import { expect } from 'chai';
import { spy, stub } from 'sinon';
import {
  followedAccountFetchedAndUpdated,
  followedAccountUpdated,
  followedAccountsRetrieved,
  followedAccountAdded,
  followedAccountRemoved,
} from './followedAccounts';
import actionTypes from '../constants/actions';
import * as accountApi from '../utils/api/account';
import accounts from '../../test/constants/accounts';

describe('actions: followedAccount', () => {
  const dispatch = spy();
  const getState = () => ({
    peers: { liskAPIClient: {} },
  });
  it('should create an action to retrieve the followed accounts list', () => {
    const data = {
      publicKey: accounts.genesis.publicKey,
      balance: accounts.genesis.balance,
      title: accounts.genesis.address,
    };
    const expectedAction = {
      data,
      type: actionTypes.followedAccountsRetrieved,
    };
    expect(followedAccountsRetrieved(data)).to.be.deep.equal(expectedAction);
  });

  it('should create an action to add a followed account', () => {
    stub(accountApi, 'getAccount').returnsPromise();
    accountApi.getAccount.resolves({
      publicKey: accounts.genesis.publicKey,
    });
    const data = {
      balance: accounts.genesis.balance,
      title: accounts.genesis.address,
    };
    const expectedAction = {
      data: { ...data, publicKey: accounts.genesis.publicKey },
      type: actionTypes.followedAccountAdded,
    };
    followedAccountAdded(data)(dispatch, getState);
    expect(dispatch).to.been.calledWith(expectedAction);
    accountApi.getAccount.restore();
  });

  it('should create an action to update a followed account', () => {
    const data = {
      publicKey: accounts.genesis.publicKey,
      balance: accounts.genesis.balance,
      title: accounts.genesis.address,
    };
    const expectedAction = {
      data,
      type: actionTypes.followedAccountUpdated,
    };
    expect(followedAccountUpdated(data)).to.be.deep.equal(expectedAction);
  });

  it('should create an action to remove a followed account', () => {
    const data = {
      publicKey: accounts.genesis.publicKey,
      balance: accounts.genesis.balance,
      title: accounts.genesis.address,
    };
    const expectedAction = {
      data,
      type: actionTypes.followedAccountRemoved,
    };
    expect(followedAccountRemoved(data)).to.be.deep.equal(expectedAction);
  });

  it('should update a followed account if balance changed', () => {
    stub(accountApi, 'getAccount').returnsPromise();
    const data = {
      title: accounts.genesis.address,
      balance: accounts.genesis.balance,
      publicKey: '',
    };

    // Case 1: balance and publicKey does not change
    accountApi.getAccount.resolves({
      balance: accounts.genesis.balance,
      publicKey: '',
    });

    followedAccountFetchedAndUpdated({ account: data })(dispatch, getState);
    expect(dispatch).to.not.have.been.calledWith();

    // Case 2: balance does change
    accountApi.getAccount.resolves({
      balance: 0,
      publicKey: '',
    });

    followedAccountFetchedAndUpdated({ account: data })(dispatch, getState);
    expect(dispatch).to.been.calledWith(followedAccountUpdated({
      publicKey: '',
      balance: 0,
      title: accounts.genesis.address,
    }));

    // Case 3: publicKey does change
    accountApi.getAccount.resolves({
      balance: accounts.genesis.balance,
      publicKey: accounts.genesis.publicKey,
    });

    followedAccountFetchedAndUpdated({ account: data })(dispatch, getState);
    expect(dispatch).to.been.calledWith(followedAccountUpdated({
      publicKey: accounts.genesis.publicKey,
      balance: accounts.genesis.balance,
      title: accounts.genesis.address,
    }));

    accountApi.getAccount.restore();
  });
});
