import React from 'react';
import DemoRenderer from '../demoRenderer';
import HardwareWalletIllustration from '.';
import { loginType } from '../../../constants/loginTypes';

const HardwareWalletIllustrationDemo = () => (
  <React.Fragment>
    <h2>HardwareWalletIllustration</h2>
    { Object.keys(loginType).map(type => (
      <DemoRenderer key={type}>
        <HardwareWalletIllustration
          account={{ loginType: type }}
          size="s"
        />
      </DemoRenderer>
    )) }
  </React.Fragment>
);

export default HardwareWalletIllustrationDemo;
