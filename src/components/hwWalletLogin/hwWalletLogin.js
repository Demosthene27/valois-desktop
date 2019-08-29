import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import MultiStep from '../multiStep';
import Loading from './loading';
import SelectDevice from './selectDevice';
import UnlockDevice from './unlockDevice';
import SelectAccount from './selectAccount';
import { getDeviceList } from '../../utils/hwWallet';
import styles from './hwWalletLogin.css';

class HardwareWalletLogin extends React.Component {
  async componentDidMount() {
    await this.updateDeviceList();
    this.props.settingsUpdated({
      token: {
        active: 'LSK',
        list: { BTC: false, LSK: true },
      },
    });
  }

  async updateDeviceList() {
    const deviceList = await getDeviceList();
    this.props.updateDeviceList(deviceList);
  }

  render() {
    const {
      devices,
      history,
      liskAPIClient,
      t,
    } = this.props;
    return (
      <React.Fragment>
        <div className={`${styles.wrapper} ${grid.row}`}>
          <MultiStep
            className={`${grid['col-xs-10']}`}
          >
            <Loading t={t} devices={devices} />
            <SelectDevice t={t} devices={devices} />
            <UnlockDevice t={t} devices={devices} history={history} />
            <SelectAccount
              t={t}
              devices={devices}
              liskAPIClient={liskAPIClient}
              history={history}
            />
          </MultiStep>
        </div>
      </React.Fragment>
    );
  }
}

export default HardwareWalletLogin;
