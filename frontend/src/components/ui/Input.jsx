import React from 'react';

const Input = ({ 
  label, 
  id, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder = '', 
  required = false, 
  disabled = false, 
  className = '',
  error = '' 
}) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="font-outfit font-medium text-sm text-text-muted uppercase tracking-wider">
          {label} {required && <span className="text-primary">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full bg-surface text-on-surface border border-border px-4 py-3 font-outfit text-sm rounded-none focus:outline-none focus:border-primary transition-colors duration-200 placeholder:text-text-muted/40"
      />
      {error && (
        <span className="font-outfit text-xs text-error mt-0.5">{error}</span>
      )}
    </div>
  );
};

export default Input;
