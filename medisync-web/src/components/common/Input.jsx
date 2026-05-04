import React from 'react';
import './Input.css';

/**
 * Componente Input reutilizable
 * @param {string} label - Etiqueta del campo
 * @param {string} error - Mensaje de error
 * @param {string} type - Tipo de input
 */
const Input = ({
  label,
  error,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  ...props
}) => {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="input-required" aria-hidden="true"> *</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`input-field ${error ? 'input-field--error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${id}-error`} className="input-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
