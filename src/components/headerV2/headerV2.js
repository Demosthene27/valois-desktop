import React from 'react';
import i18next from 'i18next';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import { SecondaryButtonV2, PrimaryButtonV2 } from '../toolbox/buttons/button';
import Feedback from '../toolbox/feedback/feedback';
import { InputV2 } from '../toolbox/inputsV2';
import { validateUrl, addHttp, getAutoLogInData, findMatchingLoginNetwork } from '../../utils/login';
import getNetwork from '../../utils/getNetwork';

import darkLogo from '../../assets/images/logo/lisk-logo-dark.svg';
import whiteLogo from '../../assets/images/logo/lisk-logo-white.svg';
import routes from '../../constants/routes';
import networks from '../../constants/networks';
import styles from './headerV2.css';
import autoSuggestInputStyles from '../autoSuggestV2/autoSuggest.css';
import formStyles from '../sendV2/form/form.css';
import DropdownV2 from '../toolbox/dropdownV2/dropdownV2';

class HeaderV2 extends React.Component {
  // eslint-disable-next-line max-statements
  constructor() {
    super();
    const { liskCoreUrl } = getAutoLogInData();
    let loginNetwork = findMatchingLoginNetwork();
    let address = '';

    if (loginNetwork) {
      loginNetwork = loginNetwork.slice(-1).shift();
    } else if (!loginNetwork) {
      loginNetwork = liskCoreUrl ? networks.customNode : networks.default;
      address = liskCoreUrl || '';
    }

    this.state = {
      address,
      showDropdown: false,
      network: loginNetwork.code,
    };

    this.getNetworksList();

    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  getNetworksList() {
    this.networks = Object.keys(networks)
      .filter(network => network !== 'default')
      .map((network, index) => ({
        label: i18next.t(networks[network].name),
        value: index,
      }));
  }

  changeAddress({ target }) {
    const address = target.value;
    this.setState({
      address,
    });
  }

  changeNetwork(network) {
    this.setState({
      network,
      ...validateUrl(this.state.address),
    });
    this.props.settingsUpdated({ network });
  }

  getNetwork(chosenNetwork) {
    const network = { ...getNetwork(chosenNetwork) };
    if (chosenNetwork === networks.customNode.code) {
      network.address = addHttp(this.state.address);
    }
    return network;
  }

  // validateCorrectNode(nextPath) {
  //   const { address } = this.state;
  //   const nodeURL = address !== '' ? addHttp(address) : address;
  //   if (this.state.network === networks.customNode.code) {
  //     const liskAPIClient = new Lisk.APIClient([nodeURL], {});
  //     liskAPIClient.node.getConstants()
  //       .then((res) => {
  //         if (res.data) {
  //           this.props.liskAPIClientSet({
  //             network: {
  //               ...this.getNetwork(this.state.network),
  //               address: nodeURL,
  //             },
  //           });
  //           this.props.history.push(nextPath);
  //         } else {
  //           throw new Error();
  //         }
  //       }).catch(() => {
  //         this.props.errorToastDisplayed({ label: i18next.t('Unable to connect to the node') });
  //       });
  //   } else {
  //     const network = this.getNetwork(this.state.network);
  //     this.props.liskAPIClientSet({ network });
  //     this.props.history.push(nextPath);
  //   }
  // }

  toggleDropdown(value) {
    // const showDropdown = !this.state.showDropdown;
    this.setState({ showDropdown: value });
  }

  render() {
    const {
      t, showSettings, showNetwork, networkList, dark,
    } = this.props;
    const selectedNetwork = this.state.network;

    return (
      <header className={`${styles.wrapper} mainHeader ${dark ? 'dark' : ''}`}>
        <div className={`${styles.headerContent}`}>
          <div className={`${styles.logo}`}>
            <img src={dark ? whiteLogo : darkLogo} />
          </div>
          <div className={`${styles.buttonsHolder}`}>
            {showNetwork &&
              <span className={`${this.props.validationError ? styles.dropdownError : ''} ${styles.dropdownHandler} network`}
                onClick={() => this.toggleDropdown(true)}>
                { selectedNetwork !== 2 ? networkList[selectedNetwork].label : this.state.address }
                <DropdownV2
                  className={styles.dropdown}
                  showArrow={false}
                  showDropdown={this.state.showDropdown}>
                  {networkList && networkList.map((network, key) => {
                    if (network.value === 2) {
                      return <span
                      className={styles.networkSpan}
                      key={key}>
                        {network.label}
                        <InputV2
                          autoComplete={'off'}
                          onChange={(value) => {
                            this.changeAddress(value);
                          }}
                          name='customNetwork'
                          value={this.state.address}
                          placeholder={this.props.t('Custom Network')}
                          className={`
                            ${formStyles.input}
                            ${autoSuggestInputStyles.input}
                            ${this.state.addressValidity ? 'error' : ''}`} />
                          <Feedback
                            show={this.props.validationError}
                            status={'error'}
                            className={`${this.props.validationError ? styles.feedbackError : ''} ${styles.feedbackMessage} amount-feedback`}
                            showIcon={false}>
{'Unable to connect to the node, please check the address and try again'}
                          </Feedback>
                          <div>
                            <PrimaryButtonV2
                              onClick={(e) => {
                                if (this.props.validationError) {
                                  e.stopPropagation();
                                } else {
                                  this.changeNetwork(2);
                                  this.props.validateCorrectNode(2, this.state.address);
                                  this.toggleDropdown(false);
                                }
                              }}
                              className={`${styles.button} ${styles.backButton}`}>
                              {t('Connect')}
                            </PrimaryButtonV2>
                          </div>
                      </span>;
                    }
                    return (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          this.changeNetwork(network.value);
                          this.props.validateCorrectNode(network.value);
                          this.toggleDropdown(false);
                        }}
                        key={key}>{network.label
                      }</span>
                    );
                  })}
                </DropdownV2>
              </span>
            }
            {showSettings
              && <Link className={styles.settingButton} to={routes.setting.path}>
                <SecondaryButtonV2 className={`${dark ? 'light' : ''}`}>
                  {t('Settings')}
                </SecondaryButtonV2>
              </Link>
            }
          </div>
        </div>
      </header>
    );
  }
}

export default translate()(withRouter(HeaderV2));
