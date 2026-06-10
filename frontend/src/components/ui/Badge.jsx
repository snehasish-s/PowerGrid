import React from 'react';

const Badge = ({ children, status = 'default', className = '' }) => {
  let badgeStyles = 'font-outfit text-xs font-semibold px-2.5 py-1 uppercase tracking-wider rounded-full border ';

  // Match styles depending on status string
  const cleanStatus = status.trim().toUpperCase();

  if (['OPERATIONAL', 'LOW', 'SUCCESS', 'COMPLETED', 'TRUE'].includes(cleanStatus)) {
    badgeStyles += 'bg-primary/10 border-primary text-primary';
  } else if (['DEGRADED', 'MEDIUM', 'WARNING', 'SCHEDULED', 'IN_PROGRESS'].includes(cleanStatus)) {
    badgeStyles += 'bg-yellow-500/10 border-yellow-500 text-yellow-500';
  } else if (['FAULTY', 'HIGH', 'CRITICAL', 'ERROR', 'OVERDUE', 'FALSE'].includes(cleanStatus)) {
    badgeStyles += 'bg-error/10 border-error text-error';
  } else if (['DECOMMISSIONED', 'NONE', 'INFO'].includes(cleanStatus)) {
    badgeStyles += 'bg-text-muted/10 border-text-muted text-text-muted';
  } else {
    badgeStyles += 'bg-primary/5 border-border text-on-surface';
  }

  return (
    <span className={`${badgeStyles} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
