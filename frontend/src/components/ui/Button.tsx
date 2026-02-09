import type { ButtonHTMLAttributes } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`button button--${variant} ${fullWidth ? 'button--full-width' : ''} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="button__spinner" aria-hidden="true" />
          <span className="visually-hidden">Cargando...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
