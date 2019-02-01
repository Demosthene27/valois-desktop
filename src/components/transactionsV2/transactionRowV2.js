import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import TransactionTypeV2 from './transactionTypeV2';
import styles from './transactionRowV2.css';
import AmountV2 from './amountV2';
import SpinnerV2 from '../spinnerV2/spinnerV2';
import LiskAmount from '../liskAmount';
import { DateFromTimestamp } from './../timestamp/index';

class TransactionRow extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  shouldComponentUpdate(nextProps) {
    return nextProps.value.id !== this.props.value.id || nextProps.value.confirmations <= 1000;
  }

  render() {
    const { props } = this;
    const onClick = !props.onClick ? (() => {}) : () => props.onClick(this.props);
    return (
      <div className={`${grid.row} ${styles.row} ${styles.clickable} transactions-row`} onClick={onClick}>
        <div className={`${grid['col-xs-6']} ${grid['col-sm-4']} ${grid['col-lg-3']} transactions-cell`}>
          <TransactionTypeV2 {...props.value}
            followedAccounts={props.followedAccounts}
            address={props.address} />
        </div>
          <div className={`${styles.hiddenXs} ${grid['col-sm-2']} ${grid['col-lg-3']} transactions-cell`}>
            <div className={`${styles.reference} transaction-reference`}>
                {props.value.asset && props.value.asset.data ?
                  <span>{props.value.asset.data}</span>
                : '-'}
            </div>
          </div>
        <div className={`${styles.hiddenXs} ${grid['col-sm-2']} ${grid['col-lg-2']} transactions-cell`}>
          {props.value.confirmations ? <DateFromTimestamp time={props.value.timestamp} />
            : <SpinnerV2 />}
        </div>
        <div className={`${styles.hiddenXs} ${grid['col-sm-2']} ${grid['col-lg-2']} transactions-cell`}>
          <LiskAmount val={props.value.fee}/> {props.t('LSK')}
        </div>
        <div className={`${grid['col-xs-6']} ${grid['col-sm-2']} ${grid['col-lg-2']} transactions-cell`}>
          <AmountV2 {...props}/>
        </div>
      </div>
    );
  }
}

export default translate()(TransactionRow);
