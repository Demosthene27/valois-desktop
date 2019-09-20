/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import i18next from 'i18next';
import reactI18next from 'react-i18next';
import ReactPiwik from 'react-piwik';
import crypto from 'crypto';
import ReactRouterDom from 'react-router-dom';
import * as ReactRedux from 'react-redux';
// TODO remove next line after upgrading node version to at least 7
import 'es7-object-polyfill';

require('jest-localstorage-mock');

Enzyme.configure({ adapter: new Adapter() });

chai.use(sinonChai);
chai.use(chaiEnzyme());
chai.use(chaiAsPromised);
sinonStubPromise(sinon);
// eslint-disable-next-line no-undef
jest.useFakeTimers();

ReactRouterDom.Link = jest.fn(
  // eslint-disable-next-line react/display-name
  ({ children, to, ...props }) => (<a {...props} href={to}>{children}</a>),
);

ReactRouterDom.withRouter = jest.fn(() => (Component => (
  // eslint-disable-next-line react/display-name
  props => (
    <Component {...{
      history: {
        push: jest.fn(),
        replace: jest.fn(),
        createHref: jest.fn(),
      },
      ...props,
    }}
    />
  )
)));

ReactRedux.connect = jest.fn(() => (Component => Component));

i18next.t = function (key, o) {
  return key.replace(/{{([^{}]*)}}/g, (a, b) => {
    const r = o[b];
    return typeof r === 'string' || typeof r === 'number' ? r : a;
  });
};
i18next.changeLanguage = jest.fn();
i18next.language = 'en';
i18next.init = () => ({
  t: i18next.t,
  language: 'en',
  changeLanguage: jest.fn(),
});

reactI18next.withTranslation = jest.fn(() => (Component => (
  // eslint-disable-next-line react/display-name
  props => (<Component {...{ ...props, t: i18next.t }} />)
)));

const localStorageMock = (() => {
  let store = {};

  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: arr => crypto.randomBytes(arr.length),
  },
});

ReactPiwik.push = () => {};
ReactPiwik.trackingEvent = () => {};
sinon.stub(ReactPiwik.prototype, 'connectToHistory').callsFake(() => 1);
sinon.stub(ReactPiwik.prototype, 'initPiwik').callsFake(() => {});

// https://github.com/nkbt/react-copy-to-clipboard/issues/20#issuecomment-414065452
// Polyfill window prompts to always confirm.  Needed for react-copy-to-clipboard to work.
global.prompt = () => true;

// Polyfill text selection functionality.  Needed for react-copy-to-clipboard to work.
// Can remove this once https://github.com/jsdom/jsdom/issues/317 is implemented.
const getSelection = () => ({
  rangeCount: 0,
  addRange: () => {},
  getRangeAt: () => {},
  removeAllRanges: () => {},
});
window.getSelection = getSelection;
document.getSelection = getSelection;

// https://stackoverflow.com/questions/53961469/testing-chart-js-with-jest-enzyme-failed-to-create-chart-cant-acquire-contex
jest.mock('react-chartjs-2', () => ({
  Line: () => null,
  Chart: () => null,
}));
