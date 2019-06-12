import React from 'react';
import styles from './newsFeed.css';
import News from './news';
import Box from '../boxV2';
import EmptyState from '../emptyStateV2';
import svg from '../../utils/svgIcons';

class NewsFeed extends React.Component {
  componentDidMount() {
    this.props.getNewsFeed();
  }

  render() {
    const {
      channels,
      newsFeed,
      showNewsFeedEmptyState,
      t,
    } = this.props;

    const filteredNewsFeed = newsFeed.filter(feed => channels[feed.source]) || [];

    return (
      <Box className={`newsFeed-box ${styles.newsFeedBox}`}>
        <header>
          <h1>{t('Community feed')}</h1>
        </header>

        <div className={`${styles.container}`}>
          <div>
            {
              filteredNewsFeed.length &&
              filteredNewsFeed.map((news, index) =>
                <div className={styles.newsWrapper} key={`newsWrapper-${index}`}>
                  <News
                    t={t}
                    {...news} />
                </div>)
            }
            {
              showNewsFeedEmptyState && !filteredNewsFeed.length &&
              <EmptyState className={'empty-news'}>
                <img src={svg.noTweetsIcon} />
                <h1>{t('No available tweets')}</h1>
                <p>{t('At this moment there is a connection problem with the tweets feed')}</p>
              </EmptyState>
            }
          </div>
        </div>
      </Box>
    );
  }
}

export default NewsFeed;
