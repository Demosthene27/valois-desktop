import React from 'react';
import { Link } from 'react-router-dom';
import { SecondaryButtonV2, PrimaryButtonV2 } from '../toolbox/buttons/button';
import Tooltip from '../toolbox/tooltip/tooltip';
import SignInTooltipWrapper from '../signInTooltipWrapper';
import routes from './../../constants/routes';
import votingConst from '../../constants/voting';
import {
  getTotalVotesCount,
  getVoteList,
  getUnvoteList,
  getTotalActions,
} from './../../utils/voting';

import styles from './votingHeader.css';

class VotingHeader extends React.Component {
  render() {
    const {
      t,
      votes,
      toggleVotingMode,
      votingModeEnabled,
    } = this.props;
    const voteList = getVoteList(votes);
    const unvoteList = getUnvoteList(votes);
    const totalActions = getTotalActions(votes);
    const {
      maxCountOfVotes,
      fee,
    } = votingConst;
    return (
      <div className={`${styles.wrapper}`}>
            <span>
              <span className={styles.box}>
                <h2>
                  <span className='total-voting-number'>{getTotalVotesCount(votes)}</span>/
                  {maxCountOfVotes}
                </h2>
                <div>{t('My votes after confirmation')}</div>
              </span>
              { votingModeEnabled ?
              <span className={`${styles.outlinedBox} ${styles.addedVotes}`}>
               <h3 className='added-votes-count'>{voteList.length}</h3>
               <span>{t('Added votes')}</span>
              </span> :
              null }
              { unvoteList.length ?
              <span className={`${styles.outlinedBox} ${styles.removedVotes}`}>
               <h3 className='removed-votes-count'>{unvoteList.length}</h3>
               <span>{t('Removed votes')}</span>
              </span> :
              null }
              { votingModeEnabled ?
              <span className={styles.outlinedBox}>
               <h3>{totalActions}
                 <Tooltip className={styles.tooltip}>
                  <p>{t('Each time you add or remove a vote it is counted as an action. There\'s {{fee}} LSK fee per every 33 actions.', { fee })}</p>
                 </Tooltip>
               </h3>
               <span className={styles.hideInMedium}>{t('Total actions (')}</span>
               <span>{t('Total fee: ')} <b>{fee * totalActions} LSK</b></span>
               <span className={styles.hideInMedium}>)</span>
              </span> :
              null }
            </span>
            { votingModeEnabled ?
            <span>
              <SecondaryButtonV2 onClick={toggleVotingMode} className={`cancel-voting-button ${styles.btn}`}>
                {t('Cancel voting')}
              </SecondaryButtonV2>
              <Link to={routes.voting.path} >
                <PrimaryButtonV2 className={`${styles.btn} go-to-confirmation-button`} disabled={totalActions === 0}>
                  {t('Go to Confirmation')}
                </PrimaryButtonV2>
              </Link>
            </span> :
            <span>
              <SignInTooltipWrapper>
                <Link to={routes.registerDelegate.path} >
                  <SecondaryButtonV2 className={`register-delegate ${styles.btn}`}>
                    {t('Register as a Delegate')}
                  </SecondaryButtonV2>
                </Link>
              </SignInTooltipWrapper>
              <SignInTooltipWrapper>
                <PrimaryButtonV2 onClick={toggleVotingMode} className={`start-voting-button ${styles.btn}`}>
                  {t('Start voting')}
                </PrimaryButtonV2>
              </SignInTooltipWrapper>
            </span>
            }
      </div>
    );
  }
}

export default VotingHeader;
