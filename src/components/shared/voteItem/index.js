import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../../../constants/routes';

import { truncateAddress } from '../../../utils/account';
import { tokenMap } from '../../../constants/tokens';
import Icon from '../../toolbox/icon';
import LiskAmount from '../liskAmount';

import styles from './styles.css';

const token = tokenMap.LSK.key;

/**
 * Displays address/delegate username along with vote amount
 *
 * @param {Object} vote object containing either or both the confirmed and unconfirmed
 * vote amount values
 * @param {String} address the address to redirect to, also used as primary text if
 * primaryText is not defined
 * @param {String} primaryText text to use instead of the address e.g. delegate username
 * @param {Boolean} truncate text to use instead of the address e.g. delegate username
 */
const VoteItem = ({
  vote, address, primaryText, truncate,
}) => {
  const accountPath = routes.account.path;
  return (
    <span className={`${styles.container} vote-item-address`}>
      <Link
        to={`${accountPath}?address=${address}`}
      >
        <span className={styles.primaryText}>
          {primaryText || (truncate ? truncateAddress(address) : address)}
        </span>
      </Link>
      <span className={styles.value}>
        {Object.values(vote).length === 2
          ? (
            <>
              <LiskAmount val={vote.confirmed} token={token} />
              <span className={styles.arrowIcon}>➞</span>
              <LiskAmount val={vote.unconfirmed} token={token} />
            </>
          )
          : <LiskAmount val={Object.values(vote)[0]} token={token} />
          }
      </span>
    </span>
  );
};

export default VoteItem;
