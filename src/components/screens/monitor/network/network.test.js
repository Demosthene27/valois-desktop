import React from 'react';
import { mount, shallow } from 'enzyme';
import Network from './network';
import peers from '../../../../../test/constants/peers';

describe('Network Monitor Page', () => {
  const setup = properties => mount(<Network {...properties} />);
  const emptyPeers = {
    isLoading: false,
    data: [],
    loadData: jest.fn(),
    clearData: jest.fn(),
    urlSearchParams: {},
  };
  const fullPeers = {
    isLoading: false,
    data: peers,
    meta: { total: peers.length },
    loadData: jest.fn(),
    clearData: jest.fn(),
    urlSearchParams: {},
  };
  const t = key => key;

  it('renders a page with header', () => {
    const wrapper = setup({ t, peers: emptyPeers });
    expect(wrapper.find('Box header')).toIncludeText('Connected peers');
  });

  it('renders the empty state if no peers passed', () => {
    const wrapper = shallow(<Network {...{ t, peers: emptyPeers }} />);
    expect(wrapper.html().match(/empty-state/gm)).toHaveLength(1);
  });

  it('shows loading overlay while the API call is being processed', () => {
    const wrapper = shallow(
      <Network
        t={t}
        peers={{
          isLoading: true,
          data: peers,
          meta: {
            total: peers.length * 2,
          },
          loadData: jest.fn(),
          clearData: jest.fn(),
          urlSearchParams: {},
        }}
      />,
    );
    expect(wrapper.html().match(/loadingOverlay/gm)).toHaveLength(1);
  });

  it('renders 20 peers', () => {
    const wrapper = shallow(<Network {...{ t, peers: fullPeers }} />);
    expect(wrapper.html().match(/peer-row/gm)).toHaveLength(20);
  });
});
