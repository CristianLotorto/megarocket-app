import React from 'react';
import styles from './button.module.css';

function Button({ clickAction, text, disabled = false, testId }) {
  return (
    <div data-testid={testId}>
      <button
        type={text.toLowerCase() === 'reset' ? 'button' : 'submit'}
        className={text.toLowerCase() === 'cancel' ? styles.btnCancel : styles.btnAccept}
        onClick={clickAction}
        disabled={disabled}
      >
        {text}
      </button>
    </div>
  );
}

export default Button;
