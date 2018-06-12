/* eslint-disable */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub, spy } from 'sinon';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';

import i18n from '../../i18n';
import Search from './index';
import * as keyAction from './../search/keyAction';

describe('SearchBar', () => {
  let wrapper;
  let history;
  let props;
  let options;
  let localStorageStub;
  const store = {};
  const peers = {
    data: {},
    status: true,
  };

  // Mocking store
  beforeEach(() => {
    localStorageStub = stub(localStorage, 'getItem');
    localStorageStub.withArgs('searches').returns([]);
    spy(keyAction, 'visitAndSaveSearch');
    spy(keyAction, 'visitAndSaveSearchOnEnter');

    history = {
      location: {
        pathname: 'explorer',
        search: '',
      },
      push: spy(),
    };
    props = {
      history,
      t: () => {},
    };
    options = {
      context: {
        store: {}, history, i18n, router: { route: history, history },
      },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
      },
      lifecycleExperimental: true,
    };
    store.getState = () => ({
      peers,
      search: {
        suggestions: {
          delegates: [],
          addresses: [],
          transactions: [],
        }
      }
    });
    store.subscribe = () => {};
    store.dispatch = () => {};
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <Search {...props} />
        </Router>
      </Provider>, options,
    );
  });

  afterEach(() => {
    localStorageStub.restore();
    keyAction.visitAndSaveSearch.restore()
    keyAction.visitAndSaveSearchOnEnter.restore()
  });

  it('should call getSearchItem on componentWillReceiveProps', () => {
    wrapper.find('Search').props().history.push('/explorer/');
    wrapper.update();
    expect(wrapper.find('.autosuggest-input').find('input')).to.have.value('');
    wrapper.find('Search').props().history.push('/explorer/transaction/123');
    wrapper.update();
    expect(wrapper.find('.autosuggest-input').find('input')).to.have.value('123');
  });

  it('should render Autosuggest', () => {
    expect(wrapper).to.have.descendants('.search-bar-input');
    expect(wrapper).to.have.descendants('.autosuggest-input');
    expect(wrapper).to.have.descendants('.autosuggest-dropdown');
  });
});

