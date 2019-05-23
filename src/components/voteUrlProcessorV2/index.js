/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';

import {
  urlVotesFound,
  voteLookupStatusCleared,
} from '../../actions/voting';
import VoteUrlProcessor from './voteUrlProcessor';

const filterObjectPropsWithValue = (object = {}, value) => (
  Object.keys(object).filter(key => object[key] === value)
);

const mapStateToProps = state => ({
  votes: state.voting.votes,
  urlVoteCount: Object.keys(state.voting.voteLookupStatus || {}).length,
  pending: filterObjectPropsWithValue(state.voting.voteLookupStatus, 'pending'),
  alreadyVoted: filterObjectPropsWithValue(state.voting.voteLookupStatus, 'alreadyVoted').concat(filterObjectPropsWithValue(state.voting.voteLookupStatus, 'notVotedYet')),
  notFound: filterObjectPropsWithValue(state.voting.voteLookupStatus, 'notFound'),
  account: state.account,
});

const mapDispatchToProps = {
  urlVotesFound,
  clearVoteLookupStatus: voteLookupStatusCleared,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(VoteUrlProcessor)));
