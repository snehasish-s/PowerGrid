import React from 'react';

const Card = ({ children, className = '', title = '', headerActions }) => {
  return (
    <div className={`bg-neutral border border-border rounded-md p-4 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_15px_rgba(3,255,171,0.08)] ${className}`}>
      {title && (
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <h3 className="font-syne font-semibold text-lg text-on-surface tracking-wide uppercase">
            {title}
          </h3>
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
