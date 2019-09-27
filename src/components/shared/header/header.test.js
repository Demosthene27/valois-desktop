import React from 'react';
import { shallow } from 'enzyme';
import Header from './header';
import SignInHeader from './signInHeader';
import TopBar from './topBar';
import routes from '../../../constants/routes';

describe('Header', () => {
  const props = {
    location: {
      pathname: '/',
    },
  };

  it('should render SignInHeader if prop.isSigninFlow', () => {
    props.isSigninFlow = true;
    const wrapper = shallow(<Header {...props} />);
    expect(wrapper).toContainMatchingElement(SignInHeader);
  });

  it('should render TopBar if prop.isSigninFlow', () => {
    props.isSigninFlow = false;
    const wrapper = shallow(<Header {...props} />);
    expect(wrapper).toContainMatchingElement(TopBar);
  });

  it('should empty render if on termsOfUse page', () => {
    props.location.pathname = routes.termsOfUse.path;
    const wrapper = shallow(<Header {...props} />);
    expect(wrapper).toBeEmptyRender();
  });
});
