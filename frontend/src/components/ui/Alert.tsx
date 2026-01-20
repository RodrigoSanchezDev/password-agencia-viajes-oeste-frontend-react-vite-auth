import React from 'react';
import './Alert.css';

interface AlertProps {
  type: 'error' | 'success';
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  return (
    <div className={`alert alert--${type}`} role="alert" aria-live="polite">
      <div className="alert__content">
        <span className="alert__icon" aria-hidden="true">
          {type === 'error' ? '⚠️' : '✓'}
        </span>
        <p className="alert__message">{message}</p>
      </div>
      {onClose && (
        <button
          className="alert__close"
          onClick={onClose}
          aria-label="Cerrar mensaje"
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
};
