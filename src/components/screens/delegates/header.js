import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Waypoint from 'react-waypoint';
import { loginType } from '../../../constants/hwConstants';
import { SecondaryButton, PrimaryButton } from '../../toolbox/buttons/button';
import Tooltip from '../../toolbox/tooltip/tooltip';
import Icon from '../../toolbox/icon';
import SignInTooltipWrapper from '../../shared/signInTooltipWrapper';
import routes from '../../../constants/routes';
import { fromRawLsk } from '../../../utils/lsk';
import votingConst from '../../../constants/voting';
import {
  getTotalVotesCount,
  getVoteList,
  getUnvoteList,
  getTotalActions,
} from '../../../utils/voting';

import styles from './header.css';

function shouldShowRegisterDelegateButton(account) {
  return account.address
    && !account.delegate
    && account.loginType === loginType.normal
    && !Object.keys(account.hwInfo).length;
}

const VotesNumber = ({ t, number, type }) => (
  <div className={`${styles.infoItem} ${styles[type]}`}>
    <figure className={styles.icon}>
      <Icon name={type} />
    </figure>
    <h5 className="added-votes-count">{number}</h5>
    <span className={styles.subTitle}>
      {
        type === 'addedVotes' ? t('Added') : t('Removed')
      }
    </span>
  </div>
);

const TotalActions = ({ t, number, fee }) => (
  <div className={`${styles.infoItem} ${styles.fee}`}>
    <figure className={styles.icon}>
      <Icon name="walletIcon" />
    </figure>
    <h5>
      <span>{`${number} LSK`}</span>
      <Tooltip className={`${styles.tooltip} showOnBottom`}>
        <p>{t('Each time you add or remove a vote it is counted as an action. There\'s {{fee}} LSK fee per every 33 actions.', { fee })}</p>
      </Tooltip>
    </h5>
    <span className={styles.subTitle}>{t('Transaction fee')}</span>
  </div>
);

const TotalVotes = ({
  t, votes, maxCountOfVotes,
}) => (
  <div className={`${styles.infoItem} ${styles.total}`}>
    <figure className={styles.icon}>
      <Icon name="totalVotes" />
    </figure>
    <h5>
      <span className="total-voting-number">{votes}</span>
      {`/${maxCountOfVotes}`}
    </h5>
    <span className={styles.subTitle}>{t('Total')}</span>
  </div>
);

const VotingActionBar = ({
  account, totalActions, toggleVotingMode, votes, t,
}) => {
  const { fee } = votingConst;
  return (
    <div className={styles.actionBar}>
      <SecondaryButton onClick={toggleVotingMode} className={`cancel-voting-button ${styles.btn}`}>
        {t('Cancel')}
      </SecondaryButton>
      <Link to={totalActions !== 0 ? routes.votingSummary.path : routes.delegates.path}>
        <PrimaryButton
          className={`${styles.btn} go-to-confirmation-button`}
          disabled={
            totalActions === 0
            || fromRawLsk(account.info.LSK.balance) < fee
            || getTotalVotesCount(votes) > 101
          }
        >
          {t('Confirm')}
        </PrimaryButton>
      </Link>
    </div>
  );
};

const NonVotingActionBar = ({
  account, toggleVotingMode, votes, t,
}) => (
  <div className={styles.actionBar}>
    { shouldShowRegisterDelegateButton(account)
      ? (
        <Link to={routes.registerDelegate.path}>
          <SecondaryButton className={`register-delegate ${styles.btn}`}>
            {t('Register as a Delegate')}
          </SecondaryButton>
        </Link>
      )
      : null
    }
    <SignInTooltipWrapper>
      <PrimaryButton onClick={toggleVotingMode} className={`start-voting-button ${styles.btn}`}>
        {Object.keys(votes).length ? t('Edit votes') : t('Start voting')}
      </PrimaryButton>
    </SignInTooltipWrapper>
  </div>
);

const VotingHeader = ({
  t,
  toggleVotingMode,
  votingModeEnabled,
}) => {
  const account = useSelector(state => state.account);
  const { votes } = useSelector(state => state.voting);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const voteList = getVoteList(votes);
  const unvoteList = getUnvoteList(votes);
  const totalActions = getTotalActions(votes);
  const { maxCountOfVotes, fee } = votingConst;

  return (
    <div className={`${styles.wrapper} voting-header ${isHeaderSticky ? `${styles.sticky} sticky` : ''}`}>
      <Waypoint
        onEnter={() => setIsHeaderSticky(false)}
        onLeave={() => setIsHeaderSticky(true)}
      />
      <div className={styles.bg} />
      <div className={styles.stickyContent}>
        <div className={styles.info}>
          { votingModeEnabled
            ? (
              <Fragment>
                <TotalVotes
                  t={t}
                  votes={getTotalVotesCount(votes)}
                  maxCountOfVotes={maxCountOfVotes}
                />
                <VotesNumber t={t} number={voteList.length} type="addedVotes" />
              </Fragment>
            )
            : (
              <div className={`${styles.box} ${styles.signedOut}`}>
                <h2>
                  {`${t('Delegates')}`}
                </h2>
                <span className={styles.subTitle}>{t('Vote for who secures the network or becomes a delegate.')}</span>
              </div>
            )
          }
          {
            unvoteList.length ? <VotesNumber number={unvoteList.length} t={t} type="removedVotes" /> : null
          }
          {
            votingModeEnabled ? <TotalActions number={maxCountOfVotes} t={t} fee={fee} /> : null
          }
        </div>
        { votingModeEnabled
          ? (
            <VotingActionBar
              votes={votes}
              account={account}
              totalActions={totalActions}
              toggleVotingMode={toggleVotingMode}
              t={t}
            />
          )
          : (
            <NonVotingActionBar
              account={account}
              toggleVotingMode={toggleVotingMode}
              votes={votes}
              t={t}
            />
          )
        }
      </div>
    </div>
  );
};

VotingHeader.defaultProps = {
  account: {},
  votes: {},
};

export default VotingHeader;
