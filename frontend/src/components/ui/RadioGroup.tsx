import React from 'react';
import './RadioGroup.css';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  name: string;
  options: readonly RadioOption[] | RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  helperText,
  disabled = false
}) => {
  const groupId = `radio-group-${name}`;
  const errorId = error ? `${groupId}-error` : undefined;
  const helperId = helperText ? `${groupId}-helper` : undefined;

  return (
    <fieldset className="radio-group" aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}>
      <legend className="radio-group__label">{label}</legend>
      <div className="radio-group__options">
        {options.map((option) => (
          <label 
            key={option.value} 
            className={`radio-group__option ${value === option.value ? 'radio-group__option--selected' : ''} ${disabled ? 'radio-group__option--disabled' : ''}`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className="radio-group__input"
            />
            <span className="radio-group__custom-radio" />
            <span className="radio-group__text">{option.label}</span>
          </label>
        ))}
      </div>
      {helperText && !error && (
        <span id={helperId} className="radio-group__helper">
          {helperText}
        </span>
      )}
      {error && (
        <span id={errorId} className="radio-group__error" role="alert" aria-live="polite">
          {error}
        </span>
      )}
    </fieldset>
  );
};
