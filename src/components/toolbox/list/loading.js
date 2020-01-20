import React from 'react';
import { isReactComponent } from '../../../utils/helpers';
import styles from '../table/table.css';

const Loading = ({ Element, headerInfo }) => (
  isReactComponent(Element)
    ? <Element />
    : (
      <div className={styles.loadingRow}>
        {
          headerInfo.map((column, index) => (
            <div
              key={`table-loading-row-${index}`}
              className={`${column.classList} ${styles.loadingColumn}`}
            />
          ))
        }
      </div>
    )
);

export default Loading;
