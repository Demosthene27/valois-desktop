import React from 'react';
import { Link } from 'react-router-dom';
import { SecondaryButtonV2, PrimaryButtonV2 } from '../toolbox/buttons/button';
import Tooltip from '../toolbox/tooltip/tooltip';
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
                <h2>{getTotalVotesCount(votes)}/{maxCountOfVotes}</h2>
                <div>{t('My votes after confirmation')}</div>
              </span>
              { votingModeEnabled ?
              <span className={`${styles.outlinedBox} ${styles.addedVotes}`}>
               <h3>{voteList.length}</h3>
               <span>{t('Added votes')}</span>
              </span> :
              null }
              { unvoteList.length ?
              <span className={`${styles.outlinedBox} ${styles.removedVotes}`}>
               <h3>{unvoteList.length}</h3>
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
              <SecondaryButtonV2 onClick={toggleVotingMode} className={styles.btn}>
                {t('Cancel voting')}
              </SecondaryButtonV2>
              <Link to={routes.voting.path} >
                <PrimaryButtonV2 className={styles.btn} disabled={totalActions === 0}>
                  {t('Go to Confirmation')}
                </PrimaryButtonV2>
              </Link>
            </span> :
            <span>
              <Link to={routes.registerDelegate.path} >
                <SecondaryButtonV2 className={`register-delegate ${styles.btn}`}>
                  {t('Register as a Delegate')}
                </SecondaryButtonV2>
              </Link>
              <PrimaryButtonV2 onClick={toggleVotingMode} className={styles.btn}>
                {t('Start voting')}
              </PrimaryButtonV2>
            </span>
            }
      </div>
    );
  }
}

export default VotingHeader;
