import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon';
import { SecondaryButtonV2 } from '../buttons/button';
import styles from './flashMessage.css';

const FlashMessage = ({
  buttonClassName,
  buttonText,
  className,
  displayText,
  iconName,
  linkCaption,
  linkClassName,
  linkUrl,
  onButtonClick,
  shouldShow,
}) => (
  <div className={`${styles.wrapper} ${shouldShow ? styles.show : ''} ${className}`}>
    {
      iconName
        ? <Icon name={iconName} className="icon" />
        : null
    }
    <span className={`${styles.text} display-text`}>
      {displayText}
    </span>
    {
      linkUrl && linkCaption
        ? (
          <a
            className={`${styles.externalLink} ${linkClassName} url-link`}
            href={linkUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {linkCaption}
          </a>
        )
        : null
    }
    {
      buttonText && onButtonClick
        ? (
          <SecondaryButtonV2
            className={`${styles.button} ${buttonClassName} small light button`}
            onClick={onButtonClick}
          >
            {buttonText}
          </SecondaryButtonV2>
        )
        : null
    }
  </div>
);

FlashMessage.propTypes = {
  buttonClassName: PropTypes.string,
  buttonText: PropTypes.string,
  className: PropTypes.string,
  displayText: PropTypes.string.isRequired,
  iconName: PropTypes.string,
  linkCaption: PropTypes.string,
  linkClassName: PropTypes.string,
  linkUrl: PropTypes.string,
  shouldShow: PropTypes.bool.isRequired,
};

FlashMessage.defaultProps = {
  buttonClassName: '',
  buttonText: '',
  className: '',
  iconName: '',
  linkCaption: '',
  linkClassName: '',
  linkUrl: '',
};

export default FlashMessage;
