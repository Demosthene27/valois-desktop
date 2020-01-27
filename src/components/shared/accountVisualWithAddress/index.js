import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './accountVisualWithAddress.css';
import Icon from '../../toolbox/icon';
import transactionTypeIcons from '../../../constants/transactionTypeIcons';
import transactionTypes from '../../../constants/transactionTypes';
import AccountVisual from '../../toolbox/accountVisual';
import regex from '../../../utils/regex';

class AccountVisualWithAddress extends React.Component {
  getTransformedAddress(address) {
    const { isMediumViewPort, bookmarks, showBookmarkedAddress } = this.props;

    if (showBookmarkedAddress) {
      const bookmarkedAddress = bookmarks[this.props.token.active].find(
        element => element.address === address,
      );
      if (bookmarkedAddress) return bookmarkedAddress.title;
    }

    /* istanbul ignore next */
    if (isMediumViewPort) {
      return address.replace(regex.lskAddressTrunk, '$1...$3');
    }

    return address;
  }

  render() {
    const {
      address, transactionSubject, transactionType, t, size, sizeM,
    } = this.props;
    return (
      <div className={`${styles.address}`}>
        {transactionType !== transactionTypes().send.code && transactionSubject === 'recipientId' ? (
          <React.Fragment>
            <Icon
              className={styles.txIcon}
              name={transactionTypeIcons[transactionType] || transactionTypeIcons.default}
            />
            <span className={styles.addressValue}>
              {transactionTypes.getByCode(transactionType).title}
            </span>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <AccountVisual address={address} size={size} sizeM={sizeM} />
            <span className={styles.addressValue}>{this.getTransformedAddress(address)}</span>
          </React.Fragment>
        )}
      </div>
    );
  }
}

AccountVisualWithAddress.propTypes = {
  address: PropTypes.string.isRequired,
  bookmarks: PropTypes.shape().isRequired,
  showBookmarkedAddress: PropTypes.bool,
  size: PropTypes.number,
  t: PropTypes.func.isRequired,
  token: PropTypes.shape().isRequired,
  transactionSubject: PropTypes.string,
  transactionType: PropTypes.oneOf(transactionTypes.getListOf('code')),
};

AccountVisualWithAddress.defaultProps = {
  showBookmarkedAddress: false,
  size: 32,
  sizeM: 24,
  transactionSubject: '',
  transactionType: transactionTypes().send.code,
};

const mapStateToProps = state => ({
  bookmarks: state.bookmarks,
  token: state.settings.token,
});

export default connect(mapStateToProps)(withTranslation()(AccountVisualWithAddress));
