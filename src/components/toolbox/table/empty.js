import React from 'react';
import styles from '../box/emptyState.css';
import { isReactComponent } from '../../../utils/helpers';
import Illustration from '../illustration';

const Empty = ({
  isListEmpty, isLoading, data, error, className,
}) => {
  if (isLoading || !isListEmpty || (error?.message !== 'Not found.')) return null;
  if (isReactComponent(data)) {
    const Element = data;
    return (<Element />);
  }
  return (
    <div className={`${styles.wrapper} ${className} empty-state`}>
      <Illustration name={data?.illustration ?? 'emptyWallet'} />
      <h3>{ data?.message ?? 'Nothing found.' }</h3>
    </div>
  );
};

export default Empty;
