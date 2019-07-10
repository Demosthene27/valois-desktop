/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import {
  loadVotes,
  voteLookupStatusCleared,
  voteToggled,
} from '../../../actions/voting';
import VoteUrlProcessor from './voteUrlProcessor';

const mapDispatchToProps = {
  voteLookupStatusCleared,
  voteToggled,
  loadVotes,
};

export default withRouter(connect(
  null,
  mapDispatchToProps,
)(translate()(VoteUrlProcessor)));
