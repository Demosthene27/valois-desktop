import React from 'react';
import { FontIcon } from '../fontIcon';
import { PrimaryButton } from '../toolbox/buttons/button';
import styles from './confirmPassphrase.css';

const ConfirmPassphraseOptions = ({
  optionIndex, options, answers, handleSelect, hasErrors, isCorrect, enabled = null,
}) => (
  <span className={`${styles.optionsHolder} ${answers[optionIndex] ? styles.answered : ''} ${hasErrors ? styles.hasErrors : ''} ${isCorrect ? styles.isCorrect : ''}`}>
    <span
      className={`${styles.answer}`}
      onClick={() => !!answers[optionIndex] && !hasErrors
        && !isCorrect && handleSelect(null, optionIndex)}
    >
      <span className={`${styles.choice}`}>
        {answers[optionIndex]}
        <span className={`${styles.checkmark}`}>
          <FontIcon value="checkmark" />
        </span>
      </span>
    </span>
    <span className={`${styles.options}`}>
      {options.map((option, optionKey) => (
        <span
          className={`${styles.option} ${answers[optionIndex] === option ? styles.selected : ''}`}
          key={optionKey}
        >
          <PrimaryButton
            className="word-option"
            size="s"
            onClick={() => handleSelect(option, optionIndex)}
            disabled={!enabled}
          >
            { option }
          </PrimaryButton>
        </span>
      ))}
    </span>
  </span>
);

export default ConfirmPassphraseOptions;
