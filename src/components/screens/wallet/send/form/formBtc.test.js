import React from 'react';
import { mount } from 'enzyme';
import { fromRawLsk } from '../../../../../utils/lsk';
import { tokenMap } from '../../../../../constants/tokens';
import Form from './form';
import accounts from '../../../../../../test/constants/accounts';

jest.mock('../../../../../utils/api/btc/transactions', () => ({
  getUnspentTransactionOutputs: jest.fn(() => Promise.resolve([{
    height: 1575216,
    tx_hash: '992545eeab2ac01adf78454f8b49d042efd53ab690d76121ebd3cddca3b600e5',
    tx_pos: 0,
    value: 1,
  }, {
    height: 1575216,
    tx_hash: '992545eeab2ac01adf78454f8b49d042efd53ab690d76121ebd3cddca3b600e5',
    tx_pos: 1,
    value: 397040,
  }])),
  getTransactionFeeFromUnspentOutputs: jest.fn(({ dynamicFeePerByte }) => dynamicFeePerByte),
}));

describe('FormBtc', () => {
  let wrapper;
  let props;
  let bookmarks;

  beforeEach(() => {
    bookmarks = {
      LSK: [],
      BTC: [],
    };

    props = {
      token: tokenMap.LSK.key,
      t: v => v,
      account: {
        balance: 12300000,
        info: {
          LSK: accounts.genesis,
          BTC: {
            address: 'mkakDp2f31btaXdATtAogoqwXcdx1PqqFo',
          },
        },
      },
      bookmarks,
      dynamicFees: {},
      dynamicFeesRetrieved: jest.fn(),
      networkConfig: {
        name: 'Mainnet',
      },
      history: {
        location: {
          path: '/wallet/send',
          search: '',
        },
        push: jest.fn(),
      },
      nextStep: jest.fn(),
    };

    wrapper = mount(<Form {...props} />);
  });

  describe('shold work with props.token BTC', () => {
    const dynamicFees = {
      Low: 156,
      High: 51,
    };

    beforeEach(() => {
      wrapper.setProps({
        token: tokenMap.BTC.key,
        dynamicFees,
      });
    });

    it('should re-render properly if props.token', () => {
      expect(wrapper).toContainMatchingElement('span.recipient');
      expect(wrapper).toContainMatchingElement('span.amount');
      expect(wrapper).toContainMatchingElement('div.processing-speed');
      expect(wrapper).not.toContainMatchingElement('label.reference');
    });

    it('should update processingSpeed fee when "High" is selected', () => {
      wrapper.find('.amount input').simulate('change', { target: { name: 'amount', value: '0.0012' } });
      expect(wrapper.find('div.processing-speed')).toIncludeText(fromRawLsk(dynamicFees.Low));
      wrapper.find('label.option-High input[type="radio"]').simulate('click').simulate('change');
      expect(wrapper.find('div.processing-speed')).toIncludeText(fromRawLsk(dynamicFees.High));
    });

    it('should call props.dynamicFeesRetrieved if props.dynamicFees is empty object', () => {
      wrapper.setProps({
        dynamicFees: {},
      });
      expect(props.dynamicFeesRetrieved).toHaveBeenCalled();
    });

    // TODO fix this feature
    it.skip('should allow to set entire balance', () => {
      wrapper.find('button.send-entire-balance-button').simulate('click');
      jest.runAllTimers();
      wrapper.update();
      expect(wrapper.find('.amount input').prop('value')).toEqual(fromRawLsk(props.account.balance - dynamicFees.Low));
    });
  });
});
