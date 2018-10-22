import React from 'react';
import { expect } from 'chai';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';

import SpecifyRequest from './specifyRequest';

describe('Specify Request', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    const priceTicker = {
      success: true,
      LSK: {
        USD: 1,
      },
    };

    const store = configureMockStore([thunk])({
      settings: {},
      settingsUpdated: () => {},
      liskService: { priceTicker },
    });

    props = {
      t: key => key,
      address: '234l',
      reference: '',
      nextStep: spy(),
      prevStep: spy(),
    };

    wrapper = mount(<Provider store={store}>
      <Router>
        <SpecifyRequest {...props}/>
      </Router>
    </Provider>);
  });

  it('accepts valid amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '120.25' } });
    expect(wrapper.find('Input.amount').text()).to.not.contain('Invalid amount');
  });

  it('recognizes invalid amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '120 INVALID' } });
    expect(wrapper.find('Input.amount').text()).to.contain('Invalid amount');
  });

  it('recognizes zero amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '0' } });
    expect(wrapper.find('Input.amount').text()).to.contain('Required');
  });

  it('recognizes empty amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '12000' } });
    wrapper.find('.amount input').simulate('change', { target: { value: '' } });
    expect(wrapper.find('Input.amount').text()).to.contain('Required');
  });
});
