// istanbul ignore file
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { settingsUpdated } from '../../actions/settings';
import { getNewsFeed } from '../../actions/liskService';
import { channels } from '../../store/reducers/settings';
import NewsFeed from './newsFeed';

const mapStateToProps = state => ({
  channels: (state.settings && state.settings.channels) ? state.settings.channels : channels,
  newsFeed: (state.liskService && state.liskService.newsFeed && !state.liskService.newsFeed.error)
    ? state.liskService.newsFeed : [],
  showNewsFeedEmptyState: (state.liskService && state.liskService.showNewsFeedEmptyState) || false,
});

const mapDispatchToProps = {
  settingsUpdated,
  getNewsFeed,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(NewsFeed));
