/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import Voting from './voting';
import { clearVotes, votePlaced } from '../../actions/voting';
import { filterObjectPropsWithValue } from '../../utils/helpers';
import { getActiveTokenAccount } from '../../utils/account';

const mapStateToProps = state => ({
  votes: state.voting.votes,
  account: getActiveTokenAccount(state),
  voteLookupStatus: {
    pending: filterObjectPropsWithValue(state.voting.voteLookupStatus, 'pending'),
    alreadyVoted: filterObjectPropsWithValue(state.voting.voteLookupStatus, 'alreadyVoted').concat(filterObjectPropsWithValue(state.voting.voteLookupStatus, 'notVotedYet')),
    notFound: filterObjectPropsWithValue(state.voting.voteLookupStatus, 'notFound'),
  },
  liskAPIClient: state.peers.liskAPIClient,
});

const mapDispatchToProps = {
  clearVotes,
  votePlaced,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(translate()(Voting)));
