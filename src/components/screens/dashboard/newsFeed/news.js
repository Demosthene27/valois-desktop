import React from 'react';
import moment from 'moment';
import Icon from '../../../toolbox/icon';
import TweetParser from './twitterParser';
import styles from './news.css';

const News = ({
  // eslint-disable-next-line camelcase
  content, timestamp, url, title, author, image_url, source,
}) => {
  const date = moment.unix(timestamp).format('DD MMM YYYY');
  const newsTitle = title || author;
  const authorText = author === 'LiskHQ' ? null
    // eslint-disable-next-line react/jsx-one-expression-per-line
    : <span> written by : <b className={styles.author}>{author}</b></span>;
  const iconSource = source === 'twitter_lisk' ? 'newsFeedTwitter' : 'newsFeedBlog';
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`${styles.news} news-item`}>
      <div className={styles.header}>
        <Icon name={iconSource} />
        <div>
          <span className={styles.title}>{newsTitle}</span>
          <span className={styles.subtitle}>
            {authorText}
            {date}
          </span>
        </div>
      </div>
      <div className={styles.description}>
        <TweetParser>
          {url ? content.replace(url, '') : url}
        </TweetParser>
      </div>
      {
        // eslint-disable-next-line camelcase
        image_url ? <img className={styles.img} src={image_url} alt={title} /> : null
      }
    </a>
  );
};

export default News;
