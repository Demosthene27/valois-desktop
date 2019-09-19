import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { subscribeToDevicesList } from '../../utils/hwManager';
import Loading from './loading';
import MultiStep from '../multiStep';
import SelectAccount from './selectAccount';
import SelectDevice from './selectDevice';
import UnlockDevice from './unlockDevice';
import RequestPin from './requestPin';
import styles from './hwWalletLogin.css';

class HardwareWalletLogin extends React.Component {
  constructor(props) {
    super(props);

    this.state = { devices: [] };

    this.deviceListener = subscribeToDevicesList(this.updateDeviceList.bind(this));
  }

  async componentDidMount() {
    this.props.settingsUpdated({
      token: {
        active: 'LSK',
        list: { BTC: false, LSK: true },
      },
    });
  }

  componentWillUnmount() {
    this.deviceListener.unsubscribe();
  }

  updateDeviceList(devices) {
    this.setState({ devices });
  }

  render() {
    const {
      history,
      network,
      t,
    } = this.props;
    const { devices } = this.state;
    return (
      <React.Fragment>
        <div className={`${styles.wrapper} ${grid.row}`}>
          <MultiStep
            className={`${grid['col-xs-10']}`}
          >
            <Loading t={t} devices={devices} network={network} />
            <SelectDevice t={t} devices={devices} />
            <RequestPin t={t} devices={devices} history={history} />
            <UnlockDevice t={t} devices={devices} history={history} />
            <SelectAccount
              t={t}
              devices={devices}
              networkConfig={network}
              history={history}
            />
          </MultiStep>
        </div>
      </React.Fragment>
    );
  }
}

export default HardwareWalletLogin;
