import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button, PrimaryButton } from '../toolbox/buttons/button';

import styles from './options.css';

const Options = ({ firstButton, secondButton, text }) =>
  (<div className={styles.optionsBody}>
    <p className={styles.text}>{text}</p>
    <section className={`${grid.row} ${styles.buttonsRow} ${grid['between-xs']}`}>
      <Button label={firstButton.text} onClick={firstButton.onClickHandler} className='ok-button' />
      <PrimaryButton label={secondButton.text} onClick={secondButton.onClickHandler} className='ok-button'/>
    </section>
  </div>);

export default Options;
