import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import routes from '../../../../../constants/routes';
import Tooltip from '../../../../toolbox/tooltip/tooltip';
import Icon from '../../../../toolbox/icon';
import AccountVisual from '../../../../toolbox/accountVisual';
import { formatAmountBasedOnLocale } from '../../../../../utils/formattedNumber';
import regex from '../../../../../utils/regex';
import styles from '../delegates.css';
import DelegateWeight from './delegateWeight';

const roundStatus = {
  forging: 'Forging',
  awaitingSlot: 'Awaiting slot',
  notForging: 'Not forging',
  missedBlock: 'Missed block',
};

const icons = {
  forging: 'delegateForged',
  awaitingSlot: 'delegateAwaiting',
  notForging: 'delegateAwaiting',
  missedBlock: 'delegateMissed',
};

const getForgingTime = (data) => {
  if (!data || data.time === -1) return '-';
  if (data.time === 0) return 'now';
  const { time, tense } = data;
  const minutes = time / 60 >= 1 ? `${Math.floor(time / 60)}m ` : '';
  const seconds = time % 60 >= 1 ? `${time % 60}s` : '';
  if (tense === 'future') {
    return `in ${minutes}${seconds}`;
  }
  return `${minutes}${seconds} ago`;
};

const DelegateDetails = ({ watched = false, data, activeTab }) => (
  <div className={styles.delegateColumn}>
    {watched
      ? <Icon name="eyeActive" className={`${activeTab !== 'active' && 'hidden'}`} />
      : <Icon name="eyeInactive" className={`${activeTab !== 'active' && 'hidden'}`} />
    }
    <div className={`${styles.delegateDetails}`}>
      <AccountVisual address={data.address} />
      <div>
        <p className={styles.delegateName}>
          {data.username}
        </p>
        <p className={`${styles.delegateAddress} showOnLargeViewPort`}>{data.address}</p>
        <p className={`${styles.delegateAddress} hideOnLargeViewPort`}>{data.address && data.address.replace(regex.lskAddressTrunk, '$1...$3')}</p>
      </div>
    </div>
  </div>
);

const RoundStatus = ({ data, t, formattedForgingTime }) => (
  <>
    <Tooltip
      title={data.forgingTime
        ? t(roundStatus[data.forgingTime.status])
        : t(roundStatus.notForging)}
      position="left"
      size="maxContent"
      content={(
        <Icon
          className={styles.statusIcon}
          name={data.forgingTime
            ? t(icons[data.forgingTime.status])
            : t(icons.notForging)}
        />
      )}
      footer={(
        <p>{formattedForgingTime}</p>
      )}
    >
      <p className={styles.statusToolip}>
        {data.lastBlock && `Last block forged ${data.lastBlock}`}
      </p>
    </Tooltip>
    {data.isBanned && (
    <Tooltip
      position="left"
      size="maxContent"
      content={<Icon className={styles.statusIcon} name="delegateWarning" />}
      footer={(
        <p>{formattedForgingTime}</p>
      )}
    >
      <p>
        {t('This delegate will be punished in upcoming rounds')}
      </p>
    </Tooltip>
    )}
  </>
);

const DelegateRow = ({
  data, className, t, activeTab,
}) => {
  const formattedForgingTime = data.forgingTime && data.forgingTime.time;

  return (
    <Link
      className={`${grid.row} ${className} delegate-row ${styles.tableRow}`}
      to={`${routes.account.path}?address=${data.address}`}
    >
      <span className={`${grid['col-xs-3']}`}>
        <DelegateDetails data={data} activeTab={activeTab} />
      </span>
      <span className={`${activeTab === 'active' ? grid['col-xs-2'] : grid['col-xs-3']}`}>
        {`${formatAmountBasedOnLocale({ value: data.productivity })} %`}
      </span>
      <span className={`${grid['col-xs-2']} ${styles.noEllipsis}`}>
        {`#${data.rank}`}
      </span>
      <span className={`${grid['col-xs-2']}`}>
        <DelegateWeight value={data.totalVotesReceived} />
      </span>
      {activeTab === 'active' ? (
        <>
          <span className={`${grid['col-xs-2']} ${styles.noEllipsis}`}>
            {getForgingTime(data.forgingTime)}
          </span>
          <span className={`${grid['col-xs-1']} ${styles.noEllipsis} ${styles.statusIconsContainer}`}>
            <RoundStatus data={data} t={t} formattedForgingTime={formattedForgingTime} />
          </span>
        </>
      ) : (
        <span className={`${grid['col-xs-2']}`}>
          <span className={`${styles.delegateStatus} ${styles[data.status]}`}>{data.status}</span>
        </span>
      )}
    </Link>
  );
};

export default React.memo(DelegateRow);
