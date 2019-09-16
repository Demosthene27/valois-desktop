import React from 'react';
import { mount } from 'enzyme';
import SelectAccount from './selectAccount';
import * as hwManager from '../../../utils/hwManager';
import routes from '../../../constants/routes';

jest.mock('../../../constants/routes.js');
jest.mock('../../../utils/hwManager');

describe('Select Account', () => {
  let wrapper;
  let props;

  const mockValue = [
    {
      name: 'Unnamed account',
      address: '123456L',
      balance: 100,
      isInitialized: true,
    },
    {
      name: 'Unnamed account',
      address: '098765L',
      balance: 50,
      isInitialized: true,
    },
    {
      name: 'Unnamed account',
      address: '112233L',
      balance: 150,
      isInitialized: true,
    },
  ];

  const newMockValue = [
    ...mockValue,
    {
      name: 'Unnamed account',
      address: '555555L',
      balance: 0,
      isInitialized: false,
    },
  ];

  hwManager.getAccountsFromDevice.mockResolvedValue(mockValue);

  beforeEach(() => {
    props = {
      devices: [
        { deviceId: 1, openApp: false, model: 'Ledger' },
        { deviceId: 2, model: 'Trezor' },
        { deviceId: '123abc', openApp: true, model: 'Ledger Nano S' },
      ],
      device: {
        deviceId: '123abc',
        model: 'Ledger Nano S',
        deviceModel: 'Ledger Nano S',
      },
      account: {
        address: '123456L',
        balance: 100,
        name: 'Lisk',
        publicKey: '123bkgj45',
      },
      network: 0,
      settings: {
        hardwareAccounts: {
          'Ledger Nano S': [
            {
              address: '123456L',
              name: 'Main',
            },
          ],
        },
      },
      t: v => v,
      history: {
        push: jest.fn(),
      },
      nextStep: jest.fn(),
      prevStep: jest.fn(),
      login: jest.fn(),
      settingsUpdated: jest.fn(),
      errorToastDisplayed: jest.fn(),
    };

    wrapper = mount(<SelectAccount {...props} />);
  });

  it('Should render SelectAccount properly', async () => {
    jest.advanceTimersByTime(2000);
    const activeDevice = await hwManager.getAccountsFromDevice();
    expect(activeDevice).toEqual(mockValue);
    expect(wrapper).toContainMatchingElement('.create-account');
    expect(wrapper).toContainMatchingElement('.hw-container');
    expect(wrapper).toContainMatchingElement('.go-back');
  });

  it('Should call push function if do click in Go Back button', () => {
    wrapper = mount(<SelectAccount {...props} />);
    expect(props.history.push).not.toBeCalledWith(routes.splashscreen.path);
    wrapper.find('.go-back').at(0).simulate('click');
    wrapper.update();
    expect(props.history.push).toBeCalledWith(routes.splashscreen.path);
  });

  it('Should change name "label" of one account', async () => {
    jest.advanceTimersByTime(2000);
    await hwManager.getAccountsFromDevice();
    wrapper.update();
    expect(wrapper.find('.hw-container')).toContainMatchingElement('.hw-account');
    wrapper.simulate('mouseover');
    wrapper.find('.edit-account').at(0).simulate('click');
    wrapper.setState({ accountOnEditMode: 0 });
    wrapper.update();
    expect(wrapper).toContainMatchingElement('.save-account');
    wrapper.find('input.account-name').at(0).simulate('change', { target: { value: 'Lisk Account' } });
    wrapper.find('.save-account').at(0).simulate('click');
    expect(wrapper.find('.account-name').at(0).text()).toEqual('Lisk Account');
  });

  it.skip('Should add another account to the list after do click on create account button', async () => {
    jest.advanceTimersByTime(2000);
    await hwManager.getAccountsFromDevice();
    wrapper.update();
    expect(wrapper).toContainMatchingElement('.create-account');
    expect(wrapper).toContainMatchingElements(3, '.hw-account');
    hwManager.getAccountsFromDevice.mockResolvedValue(newMockValue);
    wrapper.find('.create-account').at(0).simulate('click');
    await hwManager.getAccountsFromDevice();
    wrapper.update();
    expect(wrapper).toContainMatchingElements(4, '.hw-account');
  });

  it.skip('Should NOT add another account to the list after do click on create account button', async () => {
    jest.advanceTimersByTime(2000);
    hwManager.getAccountsFromDevice.mockResolvedValue(newMockValue);
    await hwManager.getAccountsFromDevice();
    wrapper.update();
    expect(wrapper).toContainMatchingElement('.create-account');
    expect(wrapper).toContainMatchingElements(4, '.hw-account');
    wrapper.find('.create-account').at(0).simulate('click');
    await hwManager.getAccountsFromDevice();
    wrapper.update();
    expect(props.errorToastDisplayed).toBeCalled();
  });

  it('Should call login function after click on a select account button', async () => {
    jest.advanceTimersByTime(2000);
    await hwManager.getAccountsFromDevice();
    wrapper.update();
    expect(wrapper.find('.hw-container')).toContainMatchingElement('.hw-account');
    wrapper.find('.select-account').at(0).simulate('click');
    expect(props.login).toBeCalled();
  });
});
