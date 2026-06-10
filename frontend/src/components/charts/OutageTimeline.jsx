import React from 'react';
import { ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import Badge from '../ui/Badge';

const OutageTimeline = ({ outages = [] }) => {
  return (
    <div className="relative border-l border-border pl-6 ml-4 space-y-6 max-h-80 overflow-y-auto pr-1">
      {outages.length === 0 ? (
        <div className="text-center py-6 text-text-muted font-outfit text-sm">
          No outages recorded recently.
        </div>
      ) : (
        outages.map((outage, index) => {
          const isActive = outage.isActive;
          return (
            <div key={outage.id} className="relative group">
              {/* Timeline dot */}
              <span className={`absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border bg-neutral transition-transform group-hover:scale-125 ${
                isActive 
                  ? 'border-primary text-primary shadow-[0_0_8px_#03FFAB]' 
                  : 'border-border text-text-muted'
              }`}>
                {isActive ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping"></span>
                ) : (
                  <CheckCircle2 size={10} />
                )}
              </span>

              {/* Timeline content */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-syne font-semibold text-sm text-on-surface uppercase tracking-wider">
                    {outage.zone} — {outage.affectedArea || 'Grid Outage'}
                  </h4>
                  <Badge status={isActive ? 'FAULTY' : 'OPERATIONAL'}>
                    {isActive ? 'Ongoing' : 'Resolved'}
                  </Badge>
                </div>
                <p className="font-outfit text-xs text-text-muted">
                  <strong className="text-on-surface">Cause:</strong> {outage.cause || 'Under Investigation'}
                </p>
                
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted mt-1">
                  <Clock size={10} />
                  <span>Start: {new Date(outage.startTime).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}</span>
                  {outage.endTime && (
                    <>
                      <span>|</span>
                      <span>End: {new Date(outage.endTime).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}</span>
                    </>
                  )}
                  <span>({outage.affectedCustomers} customers affected)</span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default OutageTimeline;
