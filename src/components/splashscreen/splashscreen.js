import React from 'react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import routes from '../../constants/routes';
import { getAutoLogInData, findMatchingLoginNetwork } from '../../utils/login';
import { parseSearchParams } from '../../utils/searchParams';
import { PrimaryButton, SecondaryButton } from '../toolbox/buttons/button';
import { getNetworksList } from '../../utils/getNetwork';
import networks from '../../constants/networks';
import Header from '../header/index';
import styles from './splashscreen.css';
import Tooltip from '../toolbox/tooltip/tooltip';

class Splashscreen extends React.Component {
  constructor() { // eslint-disable-line max-statements
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
      isValid: false,
      passphrase: '',
      network: loginNetwork.code,
      address,
    };

    this.secondIteration = false;

    this.networks = getNetworksList();
  }

  componentDidMount() {
    // istanbul ignore else
    if (!this.props.settings.areTermsOfUseAccepted) {
      this.props.history.push(routes.termsOfUse.path);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.account
      && this.props.account.address
      && !this.alreadyLoggedWithThisAddress(prevProps.account.address, prevProps.peers.options)) {
      this.redirectToReferrer();
    }
  }

  getReferrerRoute() {
    const search = parseSearchParams(this.props.history.location.search);
    const dashboardRoute = `${routes.dashboard.path}`;
    const referrerRoute = search.referrer ? search.referrer : dashboardRoute;
    return referrerRoute;
  }

  redirectToReferrer() {
    const referrerRoute = this.getReferrerRoute();
    this.props.history.replace(referrerRoute);
  }

  alreadyLoggedWithThisAddress(address, network) {
    return this.props.account
      && this.props.peers.options
      && this.props.account.address === address
      && this.props.peers.options.code === network.code
      && this.props.peers.options.address === network.address;
  }

  render() {
    const { t } = this.props;

    return (
      <React.Fragment>
        <Header dark showSettings />
        <div className={`${styles.splashscreen}`}>
          <div className={`${styles.wrapper}`}>
            <div className={`${styles.titleHolder}`}>
              <h1>{t('Welcome to the Lisk Hub!')}</h1>
              <p>
                {
                t('Create an account or sign in to manage your LSK, vote for who secures the network or become a delegate.')
              }
              </p>
            </div>
            <Link className={`${styles.button} login-button`} to={routes.login.path}>
              <SecondaryButton className="light">{t('Sign in')}</SecondaryButton>
            </Link>
            <Link className={`${styles.button} new-account-button`} to={routes.register.path}>
              <PrimaryButton>{t('Create an account')}</PrimaryButton>
            </Link>
            <span className={styles.separator}>
              <span>{t('or')}</span>
            </span>
            <span className={styles.linkWrapper}>
              <Link className={`${styles.link} explore-as-guest-button`} to={routes.dashboard.path}>
                {t('Explore as a guest')}
              </Link>
              <Tooltip
                className={`${styles.tooltip}`}
                styles={{ infoIcon: styles.infoIcon }}
                title={t('Guest mode')}
              >
                <React.Fragment>
                  <p className={`${styles.tooltipText}`}>
                    {t('You can explore Lisk network using Hub without signing in.')}
                  </p>
                  <p className={`${styles.tooltupText}`}>
                    {t('You won\'t be able to make any transactions and all the content will be in read-only mode.')}
                  </p>
                </React.Fragment>
              </Tooltip>
            </span>

            <span className={styles.linkWrapper}>
              <Link className={`${styles.link} signin-hwWallet-button`} to={routes.hwWallet.path}>
                {t('Sign in with a hardware wallet')}
              </Link>
            </span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default translate()(Splashscreen);
