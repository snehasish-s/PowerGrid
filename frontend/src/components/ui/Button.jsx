import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  type = 'button', 
  disabled = false, 
  className = '' 
}) => {
  let baseStyles = 'font-outfit font-medium text-lg uppercase tracking-wide transition-all duration-300 focus:outline-none flex items-center justify-center';
  
  let variantStyles = '';
  
  if (variant === 'primary') {
    // 54px height, thin electric green border, transparent bg, green text. On hover, filled bg + dark text + glow.
    variantStyles = 'h-[54px] px-[35px] border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-neutral text-electric-glow active:scale-[0.98]';
  } else if (variant === 'secondary') {
    // 54px height, off-white border, transparent bg. On hover, white bg + dark text.
    variantStyles = 'h-[54px] px-[35px] border-2 border-border text-on-surface bg-transparent hover:bg-on-surface hover:text-neutral hover:border-on-surface active:scale-[0.98]';
  } else if (variant === 'tertiary') {
    // text button, zero container
    variantStyles = 'text-primary hover:text-tertiary px-0 py-0 h-auto bg-transparent border-0 underline underline-offset-4';
  }
  
  if (disabled) {
    variantStyles = 'h-[54px] px-[35px] border-2 border-gray-600 text-gray-500 bg-transparent cursor-not-allowed opacity-50';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
