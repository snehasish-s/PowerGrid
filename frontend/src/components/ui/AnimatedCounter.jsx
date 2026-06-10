import React, { useState, useEffect } from 'react';

const AnimatedCounter = ({ value, duration = 1500, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const endValue = Number(value);
    
    if (isNaN(endValue)) {
      setCount(value);
      return;
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const currentVal = Math.floor(progress * endValue);
      setCount(currentVal);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {typeof count === 'number' ? count.toLocaleString() : count}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
