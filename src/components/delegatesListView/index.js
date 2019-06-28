/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { voteToggled, delegatesAdded } from '../../actions/voting';
import VotingListViewV2 from './votingListViewV2';

const mapStateToProps = state => ({
  votes: state.voting.votes,
  delegates: state.voting.delegates,
});

const mapDispatchToProps = {
  voteToggled,
  delegatesCleared: () => delegatesAdded({
    list: [],
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(VotingListViewV2));
