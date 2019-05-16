import { expect } from 'chai';
import { useFakeTimers } from 'sinon';
import account from './account';
import accounts from '../../../test/constants/accounts';
import actionTypes from '../../constants/actions';
import { lockDuration } from '../../constants/account';


describe('Reducer: account(state, action)', () => {
  let state;

  beforeEach(() => {
    const {
      passphrase,
      publicKey,
      address,
    } = accounts.genesis;
    state = {
      balance: 0,
      passphrase,
      publicKey,
      address,
    };
  });

  it('should return account object with changes if action.type = actionTypes.accountUpdated', () => {
    const action = {
      type: actionTypes.accountUpdated,
      data: {
        address: state.address,
        balance: 100000000,
        token: 'LSK',
      },
    };
    const changedAccount = account(state, action);
    expect(changedAccount).to.deep.equal({
      ...state,
      info: {
        LSK: action.data,
      },
    });
  });

  it('should return empty account object if action.type = actionTypes.accountLoggedOut', () => {
    const action = {
      type: actionTypes.accountLoggedOut,
    };
    const changedAccount = account(state, action);
    expect(changedAccount).to.deep.equal({ afterLogout: true });
  });

  it('should return loading account object if action.type = actionTypes.accountLoading', () => {
    const action = {
      type: actionTypes.accountLoading,
    };
    const changedAccount = account(state, action);
    expect(changedAccount).to.deep.equal({ loading: true });
  });

  it('should extend expireTime if action.type = actionTypes.passphraseUsed', () => {
    const clock = useFakeTimers(new Date('2017-12-29').getTime());
    const action = {
      type: actionTypes.passphraseUsed,
    };
    const changedAccount = account(state, action);
    expect(changedAccount).to.deep.equal({
      ...state,
      expireTime: clock.now + lockDuration,
    });
    clock.restore();
  });


  it('should return remove passphrase from account object if actionTypes.removePassphrase is called', () => {
    const action = {
      type: actionTypes.removePassphrase,
    };
    const changedAccount = account(state, action);
    expect(changedAccount.passphrase).to.be.equal(null);
  });

  it('should reduce account delegate when updateDelegate has been triggered', () => {
    const action = {
      data: {
        delegate: accounts['delegate candidate'],
      },
      type: actionTypes.updateDelegate,
    };
    const accountWithDelegateUpdated = account(state, action);
    expect(accountWithDelegateUpdated.delegate).to.be.equal(accounts['delegate candidate']);
  });

  it('should return state if action.type is none of the above', () => {
    const action = {
      type: 'UNKNOWN',
    };
    const changedAccount = account(state, action);
    expect(changedAccount).to.deep.equal(state);
  });

  it('should add votes to state', () => {
    const action = {
      type: actionTypes.accountAddVotes,
      votes: [{ id: 123 }],
    };
    const changedAccount = account({}, action);
    expect(changedAccount).to.deep.equal({ votes: action.votes });
  });

  it('should add lastBlock and txRegisterDelegate to state', () => {
    const action = {
      type: actionTypes.delegateStatsLoaded,
      data: {
        lastBlock: { timestamp: 0 },
        txRegisterDelegate: { timestamp: 0 },
      },
    };
    const initialState = { delegate: {} };
    const changedAccount = account(initialState, action);
    expect(changedAccount).to.deep.equal({ delegate: action.data });
  });
});

