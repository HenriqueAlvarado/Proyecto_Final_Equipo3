import React from 'react';
import './Button.css';

/**
 * Componente Button reutilizable
 * @param {string} variant - 'primary' | 'secondary' | 'danger' | 'outline'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} disabled
 * @param {boolean} loading
 * @param {function} onClick
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? <span className="btn__spinner" aria-hidden="true" /> : null}
      {children}
    </button>
  );
};

export default Button;
