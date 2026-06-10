import React, { useState, useEffect } from 'react';
import { Bell, ShieldAlert, Wifi, Info } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

const Header = () => {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch some dynamic notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const faultsResponse = await api.get('/faults/unresolved');
        const list = faultsResponse.data.slice(0, 5).map(f => ({
          id: f.id,
          type: 'fault',
          message: `FAULT: ${f.faultType} reported on ${f.asset?.assetId || 'Asset'}`,
          severity: f.severity,
          time: new Date(f.reportedAt).toLocaleDateString()
        }));
        
        // Add dynamic low stock alert if any
        try {
          const invResponse = await api.get('/inventory/low-stock');
          invResponse.data.slice(0, 2).forEach(item => {
            list.unshift({
              id: `inv-${item.id}`,
              type: 'stock',
              message: `INVENTORY: ${item.itemName} quantity is low (${item.quantity} left)`,
              severity: 'MEDIUM',
              time: 'Now'
            });
          });
        } catch (err) {
          console.error(err);
        }

        setNotifications(list);
      } catch (error) {
        // Fallback default mock notifications
        setNotifications([
          { id: 1, type: 'info', message: 'Welcome to PowerPulse AI Dashboard', severity: 'LOW', time: 'Today' },
          { id: 2, type: 'alert', message: 'CRITICAL: Feeder FD-2003 reported faulty', severity: 'CRITICAL', time: 'Yesterday' }
        ]);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const getSeverityColor = (severity) => {
    if (['CRITICAL', 'HIGH'].includes(severity)) return 'text-error border-error bg-error/5';
    if (['MEDIUM', 'WARNING'].includes(severity)) return 'text-yellow-500 border-yellow-500 bg-yellow-500/5';
    return 'text-primary border-primary bg-primary/5';
  };

  return (
    <header className="bg-surface border-b border-border h-[80px] px-8 flex items-center justify-between shrink-0 select-none">
      {/* Page Context Details */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 border border-border bg-neutral text-xs font-mono uppercase tracking-widest text-text-muted">
          <Wifi size={12} className="text-primary animate-pulse" />
          <span>SYS STATUS: CONNECTED</span>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-border bg-neutral text-xs font-mono tracking-wider text-text-muted">
          <span>{time.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>•</span>
          <span className="text-on-surface font-semibold">{time.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Notifications and Profile */}
      <div className="flex items-center gap-6">
        {/* Notifications Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2.5 border border-border bg-neutral hover:border-primary text-text-muted hover:text-primary transition-all duration-200 relative"
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-neutral text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-none shadow-[0_0_8px_#03FFAB]">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-3 w-80 bg-neutral border border-border p-4 shadow-xl z-50 rounded-none">
              <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
                <span className="font-syne font-semibold text-xs uppercase tracking-widest text-primary">Alerts & Messages</span>
                <button 
                  onClick={() => setNotifications([])}
                  className="font-outfit text-[10px] uppercase tracking-wider text-text-muted hover:text-primary"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="font-outfit text-xs text-text-muted text-center py-4">No active notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`p-2 border text-xs font-outfit flex flex-col gap-1 transition-colors hover:bg-neutral/80 ${getSeverityColor(notif.severity)}`}
                    >
                      <p className="font-semibold leading-tight">{notif.message}</p>
                      <span className="text-[10px] text-text-muted self-end font-mono">{notif.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Card */}
        {user && (
          <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-border">
            <div className="text-right">
              <p className="font-outfit font-medium text-xs text-text-muted uppercase tracking-widest">Logged In As</p>
              <p className="font-syne font-semibold text-sm text-primary tracking-wide">{user.fullName}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
