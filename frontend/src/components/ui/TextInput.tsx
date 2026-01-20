import React from 'react';
import type { InputHTMLAttributes } from 'react';
import './TextInput.css';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  helperText,
  id,
  ...props
}) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  return (
    <div className="text-input">
      <label htmlFor={inputId} className="text-input__label">
        {label}
      </label>
      <input
        id={inputId}
        className={`text-input__field ${error ? 'text-input__field--error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
        {...props}
      />
      {helperText && !error && (
        <span id={helperId} className="text-input__helper">
          {helperText}
        </span>
      )}
      {error && (
        <span id={errorId} className="text-input__error" role="alert" aria-live="polite">
          {error}
        </span>
      )}
    </div>
  );
};
