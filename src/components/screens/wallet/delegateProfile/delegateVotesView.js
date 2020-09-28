import React from 'react';

import AccountVisual from '../../../toolbox/accountVisual';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import styles from './delegateProfile.css';

const DelegateVotesView = ({
  voters,
}) => (
  <Box>
    <BoxContent className={`${styles.votesContainer} votes-container`}>
      {voters.map((address, index) => (
        <div className={styles.voteItem} key={index}>
          <AccountVisual
            className={styles.accountVisual}
            address={address}
            size={44}
          />
          <div className={styles.address}>{address}</div>
        </div>
      ))}
    </BoxContent>
  </Box>
);

export default DelegateVotesView;
