import React from 'react';
import { Zap } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', className = '', fullPage = false }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-20 w-20'
  };

  const zapSize = {
    sm: 12,
    md: 24,
    lg: 40
  };

  const spinner = (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer rotating pulse border */}
      <div className={`animate-electric-spin border-2 border-transparent border-t-primary rounded-full absolute ${sizeClasses[size]}`}></div>
      {/* Inner static/pulsing electricity icon */}
      <Zap size={zapSize[size]} className="text-primary animate-pulse text-electric-glow" />
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-neutral/95 flex flex-col gap-4 items-center justify-center z-50">
        {spinner}
        <span className="font-syne font-semibold uppercase tracking-widest text-primary text-sm mt-2">
          PowerPulse AI is initializing...
        </span>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
