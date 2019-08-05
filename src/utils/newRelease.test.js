import React from 'react';
import { mount } from 'enzyme';
import newReleaseUtil from './newRelease';
import FlashMessageHolder from '../components/toolbox/flashMessage/holder';

describe('new release util', () => {
  const callbacks = {};
  const ipc = {
    on: jest.fn((event, callback) => { callbacks[event] = callback; }),
    send: jest.fn(),
  };

  beforeEach(() => {
    ipc.send.mockClear();
    window.ipc = ipc;
  });

  it('Should return undefined if no ipc on window', () => {
    delete window.ipc;
    expect(newReleaseUtil.init()).toEqual(undefined);
  });

  it('Should call FlashMessageHolder.addMessage when ipc receives update:available', () => {
    const wrapper = mount(<FlashMessageHolder />);
    const version = '1.20.1';
    const releaseNotes = '<h2>dummy text</h2><h3>Fixed bugs</h3>';
    expect(wrapper).toBeEmptyRender();
    newReleaseUtil.init();
    expect(ipc.on).toHaveBeenCalled();
    callbacks['update:available']({}, { version, releaseNotes });
    wrapper.update();
    expect(wrapper).toIncludeText('dummy text');
    wrapper.find('button').simulate('click');
    expect(ipc.send).toBeCalled();
  });
});
