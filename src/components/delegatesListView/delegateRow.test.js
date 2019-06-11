import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import store from '../../store';
import DelegateRowV2 from './delegateRowV2';

describe('DelegateRow', () => {
  const votedStatus = { confirmed: true, unconfirmed: true, publicKey: 'sample_key' };
  const voteStatus = { confirmed: false, unconfirmed: true, publicKey: 'sample_key' };
  const unvoteStatus = { confirmed: true, unconfirmed: false, publicKey: 'sample_key' };
  const pendingStatus = {
    confirmed: true, unconfirmed: true, pending: true, publicKey: 'sample_key',
  };
  const props = {
    data: {
      rank: 12,
      username: 'sample_username',
      account: { address: 'sample_address' },
    },
    voteToggled: () => {},
  };
  const options = {
    context: { store },
    childContextTypes: { store: PropTypes.object.isRequired },
  };

  it('should have a list item with class name of "pendingRow" when props.data.pending is true', () => {
    const wrapper = mount(
      <DelegateRowV2 {...props} voteStatus={pendingStatus}></DelegateRowV2>,
      options,
    );
    const expectedClass = 'pendingRow';
    const className = wrapper.find('ul').prop('className');
    expect(className).to.contain(expectedClass);
  });

  it.skip('should have a list item with class name of "votedRow" when voteStatus.unconfirmed and confirmed are true', () => {
    const wrapper = mount(
      <DelegateRowV2 {...props} voteStatus={votedStatus}></DelegateRowV2>,
      options,
    );
    const expectedClass = 'votedRow';
    const className = wrapper.find('ul').prop('className');
    expect(className).to.contain(expectedClass);
  });

  it('should have a list item with class name of "downVoteRow" when voteStatus.unconfirmed is false but confirmed is true', () => {
    const wrapper = mount(
      <DelegateRowV2 {...props} voteStatus={unvoteStatus}></DelegateRowV2>,
      options,
    );
    const expectedClass = 'downVoteRow';
    const className = wrapper.find('ul').prop('className');
    expect(className).to.contain(expectedClass);
  });

  it('should have a list item with class name of "upVoteRow" when voteStatus.unconfirmed is false but confirmed is true', () => {
    const wrapper = mount(
      <DelegateRowV2 {...props} voteStatus={voteStatus}></DelegateRowV2>,
      options,
    );
    const expectedClass = 'upVoteRow';
    const className = wrapper.find('ul').prop('className');
    expect(className).to.contain(expectedClass);
  });
});
