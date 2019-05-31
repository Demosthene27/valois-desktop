/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';

import {
  urlVotesFound,
  voteLookupStatusCleared,
} from '../../actions/voting';
import VoteUrlProcessor from './voteUrlProcessor';

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
  urlVotesFound,
  clearVoteLookupStatus: voteLookupStatusCleared,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(VoteUrlProcessor)));
