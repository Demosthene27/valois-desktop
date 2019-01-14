import React from 'react';
import styles from './dropdownV2.css';

const DropdownV2 = ({ children, showDropdown }) => (
  <div className={`${styles.dropdown} ${showDropdown && styles.show}`}>
    <span className={`${styles.dropdownArrow}`}>
      <svg stroke="inherit" fill="currentColor" viewBox="0 0 36 9">
        <path d="M2 9c9-2 11-7.5 16-7.5S27 7 34 9"/>
      </svg>
    </span>
    <div className={`${styles.optionsHolder}`}>
      { children.map((child, key) => (
        <span key={key} className={`${styles.option}`}>{child}</span>
      )) }
    </div>
  </div>
);

export default DropdownV2;
