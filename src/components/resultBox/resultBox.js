import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button, ActionButton } from '../toolbox/buttons/button';
import { FontIcon } from '../fontIcon';
import CopyToClipboard from '../copyToClipboard';
import Piwik from '../../utils/piwik';
import styles from './resultBox.css';
import check from '../../assets/images/icons/check.svg';
import { getIndexOfBookmark } from '../../utils/bookmarks';
import { getTokenFromAddress } from '../../utils/api/transactions';

class ResultBox extends React.Component {
  componentDidMount() {
    if (typeof this.props.onMount === 'function') {
      this.props.onMount(true, 'ResultBox');
    }
  }

  isNotYetBookmarked(address) {
    const { bookmarks } = this.props;
    const token = getTokenFromAddress(address);
    return getIndexOfBookmark(bookmarks, { address, token }) === -1;
  }

  handleRetryButton() {
    this.props.transactionFailedClear();
    this.props.prevStep({
      success: null,
      account: this.props.account,
      recipient: this.props.recipient,
      amount: this.props.amount,
      password: { value: '' },
    });
  }

  onAddToBookmarks() {
    Piwik.trackingEvent('ResultBox', 'button', 'Add to bookmarks');
    this.props.nextStep({ address: this.props.recipientId });
  }

  onAddToFollowedAccounts() {
    Piwik.trackingEvent('ResultBox', 'button', 'Add to bookmarks accounts');
    this.props.transactionFailedClear();
    this.props.prevStep({
      success: null,
      account: this.props.account,
      recipient: this.props.recipient,
      amount: this.props.amount,
      password: { value: '' },
    });
  }

  onOk() {
    Piwik.trackingEvent('ResultBox', 'button', 'ok');
    this.props.transactionFailedClear();
    // istanbul ignore else
    if (typeof this.props.finalCallback === 'function') this.props.finalCallback();
    this.props.reset();
    this.props.history.replace(this.props.history.location.pathname);
  }

  render() {
    return (
      <div className={`${styles.resultBox}`}>
        <div>
          <header>
            <div className={styles.header}>
              {this.props.success
                ? <img src={check} className={styles.icon}/>
                : <FontIcon value='error' className={styles.icon}/>
              }
            </div>
            <h2 className='result-box-header'>{this.props.title}</h2>
          </header>

          <p className='result-box-message'>
            {this.props.body}
          </p>
          {this.props.copy ?
            <CopyToClipboard value={this.props.copy.value}
              text={this.props.copy.title}
              className={`${styles.copy}`} /> :
            null
          }
        </div>

        <footer className={`${grid.row} ${grid['center-xs']} ${grid['center-sm']} ${grid['center-md']} ${grid['center-lg']}`}>
          {this.props.success &&
            this.props.recipientId && this.isNotYetBookmarked(this.props.recipientId) ?
            <div className={`${grid['col-xs-6']} ${grid['col-sm-6']} ${grid['col-md-5']} ${grid['col-lg-5']}`}>
              <Button className={`add-to-bookmarks ${styles.addFollowedAccountButton}`}
                onClick={this.onAddToBookmarks.bind(this)}>
                {this.props.t('Add to bookmarks')}
              </Button>
            </div> : null
          }
          {!this.props.success && this.props.account && this.props.account.hwInfo ?
            <div className={`${grid['col-xs-6']} ${grid['col-sm-6']} ${grid['col-md-5']} ${grid['col-lg-5']}`}>
              <Button className={`add-follwed-account-button ${styles.addFollowedAccountButton}`}
                onClick={this.onAddToFollowedAccounts.bind(this)}>
                {this.props.t('Retry')}
              </Button>
            </div> : null
          }
          <div className={`${grid['col-xs-6']} ${grid['col-sm-6']} ${grid['col-md-5']} ${grid['col-lg-5']}`}>
            <ActionButton className={`okay-button ${styles.okButton}`}
              onClick={this.onOk.bind(this)}>
              {this.props.t('Okay')}
            </ActionButton>
          </div>
          <div className='subTitle'>{this.props.subTitle}</div>
        </footer>
      </div>

    );
  }
}

export default ResultBox;
