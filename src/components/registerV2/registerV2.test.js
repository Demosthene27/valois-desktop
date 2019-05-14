import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import i18n from '../../i18n';
import RegisterV2 from './registerV2';

describe('V2 Register Process', () => {
  let wrapper;
  const store = configureMockStore([thunk])({});
  const options = {
    context: { i18n, store },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
    },
  };

  beforeEach(() => {
    wrapper = mount(<MemoryRouter><RegisterV2 /></MemoryRouter>, options);
  });

  it('Should render on initial step -> Choose Avatar', () => {
    expect(wrapper.find('ChooseAvatar')).to.have.length(1);
  });
});
