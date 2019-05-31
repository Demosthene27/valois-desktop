import React from 'react';
import { mount } from 'enzyme';
import accounts from '../../../../test/constants/accounts';
import HeaderAccountInfo from './headerAccountInfo';

describe('HeaderAccountInfo Component', () => {
  const defaultProps = {
    address: accounts.genesis.address,
    bookmarks: { LSK: [], BTC: [] },
    account: accounts.genesis,
    delegate: {},
    t: v => v,
    token: 'LSK',
  };

  it('Should show information for own account', () => {
    const props = { ...defaultProps };
    const wrapper = mount(<HeaderAccountInfo {...props} />);
    expect(wrapper).toContainExactlyOneMatchingElement('.label');
    expect(wrapper.find('.title')).toHaveText('Account');
    expect(wrapper.find('.label')).toHaveText('My Account');
    expect(wrapper.find('.address')).toHaveText(props.address);
  });

  it('Should show information for bookmark', () => {
    const props = {
      ...defaultProps,
      bookmarks: {
        LSK: [{
          address: accounts['empty account'].address,
          title: 'bookmark-test',
        }],
        BTC: [],
      },
      address: accounts['empty account'].address,
    };
    const wrapper = mount(<HeaderAccountInfo {...props} />);
    expect(wrapper).toContainExactlyOneMatchingElement('.label');
    expect(wrapper.find('.title')).toHaveText('bookmark-test');
    expect(wrapper.find('.label')).toHaveText('Bookmarked Account');
  });

  it('Should show information for delegate account', () => {
    const props = {
      ...defaultProps,
      address: accounts.delegate.address,
      delegate: accounts.delegate,
    };
    const wrapper = mount(<HeaderAccountInfo {...props} />);
    expect(wrapper).toContainExactlyOneMatchingElement('.label');
    expect(wrapper.find('.title')).toHaveText(props.delegate.username);
    expect(wrapper.find('.label')).toHaveText('Delegate #{{rank}}');
  });

  it('Should show information for not bookmark', () => {
    const props = {
      ...defaultProps,
      address: accounts['empty account'].address,
    };
    const wrapper = mount(<HeaderAccountInfo {...props} />);
    expect(wrapper).not.toContainMatchingElement('.label');
    expect(wrapper.find('.title')).toHaveText('Account');
  });
});
