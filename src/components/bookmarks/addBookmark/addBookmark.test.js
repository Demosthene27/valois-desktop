import React from 'react';
import { mount } from 'enzyme';
import { tokenMap, tokenKeys } from '../../../constants/tokens';
import networks from '../../../constants/networks';
import accounts from '../../../../test/constants/accounts';
import AddBookmark from './addBookmark';

describe('Add a new bookmark component', () => {
  const bookmarks = {
    LSK: [],
    BTC: [],
  };
  const props = {
    t: v => v,
    token: {
      active: tokenMap.LSK.key,
    },
    bookmarks,
    network: networks.testnet,
    history: {
      push: jest.fn(),
    },
    accounts: {},
    bookmarkAdded: jest.fn(),
    searchAccount: jest.fn(),
  };
  const addresses = {
    BTC: 'mkakDp2f31btaXdATtAogoqwXcdx1PqqFo',
    LSK: accounts.genesis.address,
  };

  let wrapper;

  beforeEach(() => {
    wrapper = mount(<AddBookmark {...props} />);
  });


  afterEach(() => {
    props.history.push.mockClear();
    props.bookmarkAdded.mockClear();
    props.searchAccount.mockReset();
  });

  it('Should render properly and with pristine state', () => {
    expect(wrapper).not.toContainMatchingElement('.error');
    expect(wrapper).toContainMatchingElements(2, 'Input');
    expect(wrapper.find('button').at(0)).toBeDisabled();
  });

  describe('Success scenarios', () => {
    tokenKeys.forEach((token) => {
      it(`Should add ${token} account`, () => {
        wrapper.setProps({ token: { active: token } });
        wrapper.find('input[name="address"]').first().simulate('change', {
          target: {
            value: addresses[token],
            name: 'address',
          },
        });
        wrapper.find('input[name="label"]').at(0).simulate('change', {
          target: {
            value: `label-${token}`,
            name: 'label',
          },
        });
        expect(wrapper).not.toContainMatchingElement('.error');
        expect(wrapper.find('button').at(0)).not.toBeDisabled();
        wrapper.find('button').at(0).simulate('click');
        expect(props.bookmarkAdded).toBeCalled();
        expect(props.history.push).toBeCalled();
      });
    });

    it('should not be possible to change delegate label', () => {
      props.searchAccount.mockImplementation(({ address }) => {
        const account = { address, delegate: { username: accounts.delegate.username } };
        wrapper.setProps({ accounts: { ...props.accounts, [address]: account } });
      });
      wrapper.find('input[name="address"]').first().simulate('change', {
        target: {
          value: accounts.delegate.address,
          name: 'address',
        },
      });
      expect(wrapper.find('input[name="label"]')).toHaveValue(accounts.delegate.username);
      expect(wrapper.find('input[name="label"]')).toHaveProp('readOnly', true);
      expect(wrapper.find('button').at(0)).not.toBeDisabled();
      wrapper.find('button').at(0).simulate('click');
    });
  });

  describe('Fail scenarios', () => {
    beforeEach(() => {
      wrapper.setProps({
        bookmarks: {
          LSK: [{ address: addresses.LSK, title: 'genesis' }],
          BTC: [{ address: addresses.BTC, title: 'btc' }],
        },
      });
    });

    tokenKeys.forEach((token) => {
      it(`should not be possible to add already bookmarkd address - ${token}`, () => {
        wrapper.find('input[name="address"]').first().simulate('change', {
          target: {
            value: addresses[token],
            name: 'address',
          },
        });
        expect(wrapper.find('input[name="address"]')).toHaveClassName('error');
        expect(wrapper).toContainMatchingElement('.error');
      });

      it(`should show error on invalid address - ${token}`, () => {
        wrapper.find('input[name="address"]').first().simulate('change', {
          target: {
            value: 'invalidAddress',
            name: 'address',
          },
        });
        expect(wrapper.find('input[name="address"]')).toHaveClassName('error');
        expect(wrapper).toContainMatchingElement('.error');
      });

      it(`should show error on label too long - ${token}`, () => {
        wrapper.find('input[name="label"]').first().simulate('change', {
          target: {
            value: 'Really long bookmark name',
            name: 'label',
          },
        });
        expect(wrapper.find('input[name="label"]')).toHaveClassName('error');
        expect(wrapper).toContainMatchingElement('.error');
      });
    });
  });

  describe('Token switching', () => {
    it('Should clear the fields each time active token is changed', () => {
      wrapper.setProps({ token: { active: tokenMap.LSK.key } });
      wrapper.find('input[name="address"]').first().simulate('change', {
        target: {
          value: accounts.delegate.address,
          name: 'address',
        },
      });
      expect(wrapper.find('input[name="address"]')).toHaveValue(accounts.delegate.address);
      wrapper.setProps({ token: { active: tokenMap.BTC.key } });
      wrapper.update();
      expect(wrapper.find('input[name="address"]')).toHaveValue('');
    });
  });
});
