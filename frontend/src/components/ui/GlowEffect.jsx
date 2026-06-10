import React from 'react';

const GlowEffect = ({ children, active = true, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {active && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-tertiary rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
      )}
      <div className="relative">
        {children}
      </div>
    </div>
  );
};

export default GlowEffect;
