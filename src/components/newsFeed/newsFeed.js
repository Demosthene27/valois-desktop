import React from 'react';
import styles from './newsFeed.css';
import News from './news';
import Box from '../boxV2';
import logo from '../../assets/images/Lisk-Logo.svg';
import ShowMore from '../showMore';

class NewsFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
    };

    props.getNewsFeed();
  }

  onShowMore() {
    this.setState({ showMore: !this.state.showMore });
  }

  render() {
    const onShowMore = this.state.showMore ? styles.showMore : '';

    const filteredNewsFeed = this.props.newsFeed
      ? this.props.newsFeed.filter(feed => this.props.channels[feed.source]) : [];

    return (
      <Box className={`newsFeed-box ${styles.newsFeedBox}`}>
        <header className={styles.header}>
          <h1>{this.props.t('News')}</h1>
        </header>

        <div className={`${styles.container} ${onShowMore}`}>
          {
            <div>
              {
                filteredNewsFeed.length > 0 &&
                filteredNewsFeed.map((news, index) =>
                  <div className={styles.newsWrapper} key={`newsWrapper-${index}`}>
                    <News
                      t={this.props.t}
                      {...news} />
                  </div>)
              }
              {
                this.props.showNewsFeedEmptyState && filteredNewsFeed.length === 0 &&
                (<div className={`${styles.emptyNews} empty-news`}>
                  {this.props.t('No newsfeed available')}
                  <img className={styles.liskLogo} src={logo} />
                </div>)
              }
            </div>
          }
        </div>
        {
          filteredNewsFeed.length > 4 && !this.state.showSettings &&
          <ShowMore
            className={`${styles.showMoreAlign} show-more`}
            onClick={() => this.onShowMore()}
            text={this.state.showMore ? this.props.t('Show Less') : this.props.t('Show More')}
          />
        }
      </Box>
    );
  }
}

export default NewsFeed;
