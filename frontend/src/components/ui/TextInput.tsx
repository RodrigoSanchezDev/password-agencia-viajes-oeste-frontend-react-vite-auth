import React, { useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
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
  type,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  
  const isPasswordField = type === 'password';
  const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="text-input">
      <label htmlFor={inputId} className="text-input__label">
        {label}
      </label>
      <div className="text-input__wrapper">
        <input
          id={inputId}
          type={inputType}
          className={`text-input__field ${error ? 'text-input__field--error' : ''} ${isPasswordField ? 'text-input__field--password' : ''}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          {...props}
        />
        {isPasswordField && (
          <button
            type="button"
            className="text-input__toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
          </button>
        )}
      </div>
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
