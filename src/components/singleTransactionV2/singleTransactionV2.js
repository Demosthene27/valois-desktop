import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import { DateTimeFromTimestamp } from '../timestamp';
import CopyToClipboard from '../toolbox/copyToClipboard';
import LiskAmount from '../liskAmount';
import BoxV2 from '../boxV2';
import { SecondaryButtonV2 } from '../toolbox/buttons/button';
import TransactionDetailViewV2 from '../transactionsV2/transactionDetailViewV2/transactionDetailViewV2';
import styles from './singleTransactionV2.css';
import NotFound from '../notFound';
import routes from '../../constants/routes';

class SingleTransactionV2 extends React.Component {
  constructor(props) {
    super();

    if (props.peers.liskAPIClient) {
      props.loadSingleTransaction({
        id: props.match.params.id,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.activeToken !== prevProps.activeToken) {
      this.props.history.push(routes.dashboard.path);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.peers.liskAPIClient !== this.props.peers.liskAPIClient
      || nextProps.match.params.id !== this.props.match.params.id) {
      this.props.loadSingleTransaction({
        id: nextProps.match.params.id,
      });
      return false;
    }
    return true;
  }

  getLinkToCopy() {
    return {
      LSK: `lisk:/${this.props.match.url}`,
      BTC: this.props.transaction.explorerLink,
    }[this.props.activeToken];
  }

  // eslint-disable-next-line complexity
  render() {
    const { t, transaction, activeToken } = this.props;
    return (
      <div className={`${grid.row} ${grid['center-xs']} ${styles.container}`}>
        { transaction.id && !transaction.error ? (
          <BoxV2 className={styles.wrapper}>
            <header className={`${styles.detailsHeader} tx-header`}>
              <h1>{t('Transaction details')}</h1>
              <CopyToClipboard
                value={this.getLinkToCopy()}
                text={t('Copy link')}
                Container={SecondaryButtonV2}
                containerClassName="extra-small"
                copyClassName={styles.copyIcon}
              />
            </header>
            <main className={styles.mainContent}>
              <TransactionDetailViewV2
                address={this.props.address}
                activeToken={activeToken}
                transaction={transaction}
              />
              <footer className={styles.detailsFooter}>
                <div>
                  <p className={styles.value}>
                    <span className={styles.label}>{t('Date')}</span>
                    <span className={`${styles.date} tx-date`}>
                      <DateTimeFromTimestamp
                        fulltime
                        className="date"
                        time={transaction.timestamp}
                        token={activeToken}
                        showSeconds
                      />
                    </span>
                  </p>
                  <p className={styles.value}>
                    <span className={styles.label}>
                      {t('Transaction fee')}
                      {' '}
                    </span>
                    <span className="tx-fee">
                      <LiskAmount val={transaction.fee} />
                      {' '}
                      {t('LSK')}
                    </span>
                  </p>
                </div>
                <div>
                  <p className={`${styles.value}`}>
                    <span className={styles.label}>
                      {t('Confirmations')}
                      {' '}
                    </span>
                    <span className="tx-confirmation">
                      {transaction.confirmations || 0}
                    </span>
                  </p>
                </div>
                <div>
                  <div className={`${styles.value}`}>
                    <span className={styles.label}>
                      {t('Transaction ID')}
                    </span>
                    <span className="transaction-id">
                      <CopyToClipboard
                        value={transaction.id}
                        className="tx-id"
                        containerClassName="extra-small"
                        copyClassName={styles.copyIcon}
                      />
                    </span>
                  </div>
                </div>
              </footer>
            </main>
          </BoxV2>
        ) : transaction.errors && transaction.errors.length && (
        <NotFound />
        )}
      </div>
    );
  }
}

export default translate()(SingleTransactionV2);
