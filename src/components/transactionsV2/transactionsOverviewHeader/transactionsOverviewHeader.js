import React from 'react';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../../toolbox/buttons/button';
import RequestV2 from '../../requestV2/requestV2';
import { getIndexOfFollowedAccount } from '../../../utils/followedAccounts';
import DropdownV2 from '../../toolbox/dropdownV2/dropdownV2';
import HeaderAccountInfo from './headerAccountInfo';
import styles from './transactionsOverviewHeader.css';
import routes from '../../../constants/routes';

class transactionsHeader extends React.Component {
  constructor() {
    super();

    this.state = {
      showRequestDropdown: false,
    };

    this.toggleRequestDropdown = this.toggleRequestDropdown.bind(this);
    this.handleClickOutsideRequest = this.handleClickOutsideRequest.bind(this);
    this.setRequestDropdownRef = this.setRequestDropdownRef.bind(this);
  }

  toggleRequestDropdown() {
    if (!this.state.showRequestDropdown) {
      document.addEventListener('click', this.handleClickOutsideRequest);
    } else {
      document.removeEventListener('click', this.handleClickOutsideRequest);
    }

    this.setState(prevState => ({ showRequestDropdown: !prevState.showRequestDropdown }));
  }

  // istanbul ignore next
  handleClickOutsideRequest(e) {
    if (this.requestDropdownRef && this.requestDropdownRef.contains(e.target)) return;
    this.toggleRequestDropdown();
  }

  setRequestDropdownRef(node) {
    this.requestDropdownRef = node;
  }

  render() {
    const {
      followedAccounts, address, t, delegate = {},
    } = this.props;

    const isFollowing = getIndexOfFollowedAccount(followedAccounts, { address }) !== -1;
    const isWalletRoute = this.props.match.url === routes.wallet.path;

    return (
      <header className={`${styles.wrapper}`}>
        <HeaderAccountInfo
          followedAccounts={followedAccounts}
          address={address}
          delegate={delegate}
          account={this.props.account}
          />
        <div className={`${styles.buttonsHolder}`}>
        { isWalletRoute ? (
          <React.Fragment>
            <span
              ref={this.setRequestDropdownRef}
              className={`${styles.requestContainer} help-onboarding tx-receive-bt`}>
              <SecondaryButtonV2 onClick={this.toggleRequestDropdown}>
                {t('Request LSK')}
              </SecondaryButtonV2>
              <DropdownV2 showDropdown={this.state.showRequestDropdown} className={`${styles.requestDropdown} request-dropdown`}>
                <RequestV2 address={address} />
              </DropdownV2>
            </span>
            <Link to={`${routes.send.path}?wallet`} className={'tx-send-bt'}>
              <PrimaryButtonV2>
                {t('Send LSK')}
              </PrimaryButtonV2>
            </Link>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Link to={`${routes.send.path}?wallet&recipient=${address}`}
              className={'send-to-address'}>
                <SecondaryButtonV2>
                  {t('Send LSK to this Wallet')}
                </SecondaryButtonV2>
            </Link>
            <span>
            { isFollowing ? (
              <PrimaryButtonV2>
                {t('Follow')}
              </PrimaryButtonV2>
            ) : (
              <SecondaryButtonV2>
                {t('Following')}
              </SecondaryButtonV2>
            )}
            </span>
          </React.Fragment>
        )}
        </div>
      </header>
    );
  }
}

export default translate()(transactionsHeader);
