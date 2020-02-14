import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { withTranslation } from 'react-i18next';
import styles from './delegates.css';
import DelegatesTable from './table';
import Header from './header';
import Onboarding from '../../toolbox/onboarding/onboarding';
import { clearVotes, loadVotes } from '../../../actions/voting';

const getOnboardingSlides = t => (
  [{
    title: t('Welcome to Lisk Delegates!'),
    content: t('Lisk\'s blockchain is based on the Delegated Proof of Stake (DPoS) consensus algorithm, in which 101 delegates are voted in by token holders to secure the network.'),
    illustration: 'welcomeLiskDelegates',
  }, {
    title: t('Your voice matters'),
    content: t('Voting for delegates gives Lisk users the opportunity to choose who they trust to secure the network and validate the transactions that are sent on it.'),
    illustration: 'yourVoiceMatters',
  }, {
    title: t('Casting a vote'),
    content: t('We encourage community members to research individual delegate contributions to the Lisk ecosystem before voting. There are several community created sites which can assist with the process.'),
    illustration: 'getRewarded',
  }, {
    title: t('Expand your knowledge'),
    content: t('Want to know more? We’ve got you covered. Read more about Lisk’s consensus algorithm and its benefits in the Lisk Academy.'),
    illustration: 'expandYourKnowledge',
  }]
);

const Delegates = ({
  t,
}) => {
  const [votingMode, setVotingMode] = useState(false);
  const account = useSelector(state => state.account);
  const dispatch = useDispatch();
  // eslint-disable-next-line prefer-const
  let wrapper = React.createRef();
  const isSignedIn = account.info && account.info.LSK;

  const toggleVotingMode = () => {
    if (votingMode) {
      dispatch(clearVotes());
    }
    setVotingMode(!votingMode);
  };

  useEffect(() => {
    if (isSignedIn) {
      dispatch(loadVotes({
        address: account.info.LSK.address,
      }));
    }
  }, []);

  return (
    <div className={`${grid.row} ${styles.wrapper}`} ref={wrapper}>
      <Onboarding
        slides={getOnboardingSlides(t)}
        finalCallback={toggleVotingMode}
        actionButtonLabel={t('Start voting')}
        name="delegateOnboarding"
      />
      <Header
        t={t}
        votingModeEnabled={votingMode}
        toggleVotingMode={toggleVotingMode}
      />
      <section className={`${grid['col-sm-12']} ${grid['col-md-12']} ${styles.votingBox} ${styles.votes}`}>
        <DelegatesTable
          votingModeEnabled={votingMode}
          isSignedIn={isSignedIn}
        />
      </section>
    </div>
  );
};

export default withTranslation()(Delegates);
