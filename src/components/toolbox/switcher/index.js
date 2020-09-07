import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { withRouter } from 'react-router';
import { addSearchParamsToUrl } from '../../../utils/searchParams';
import styles from './switcher.css';

const TabLink = withRouter(({
  children, to, className, history, data,
}) => {
  const linkEl = useRef(null);
  const onClick = () => {
    addSearchParamsToUrl(history, { tab: to, ...data });
  };

  return (
    <li onClick={onClick} ref={linkEl} className={className}>{ children }</li>
  );
});

const Switcher = ({ options, active }) => (
  <div className={styles.wrapper}>
    <ul className={styles.options}>
      {options.map(tab => (
        <TabLink
          className={[
            tab.value === active && styles.active,
            tab.className,
          ].filter(Boolean).join(' ')}
          key={tab.value}
          data-value={tab.value}
          to={tab.value}
        >
          {tab.name}
        </TabLink>
      ))}
    </ul>
  </div>
);

Switcher.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    className: PropTypes.string,
  })),
  onClick: PropTypes.func.isRequired,
  active: PropTypes.string.isRequired,
};

export default Switcher;
