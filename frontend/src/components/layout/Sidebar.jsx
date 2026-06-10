import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  AlertTriangle, 
  Wrench, 
  Map, 
  BrainCircuit, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  User,
  Zap
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['ADMIN', 'FIELD_ENGINEER', 'MAINTENANCE_MANAGER', 'EXECUTIVE'] },
    { name: 'Assets', path: '/assets', icon: Layers, roles: ['ADMIN', 'FIELD_ENGINEER', 'MAINTENANCE_MANAGER', 'EXECUTIVE'] },
    { name: 'Faults Log', path: '/faults', icon: AlertTriangle, roles: ['ADMIN', 'FIELD_ENGINEER', 'MAINTENANCE_MANAGER', 'EXECUTIVE'] },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench, roles: ['ADMIN', 'MAINTENANCE_MANAGER'] },
    { name: 'Map View', path: '/map', icon: Map, roles: ['ADMIN', 'FIELD_ENGINEER', 'MAINTENANCE_MANAGER', 'EXECUTIVE'] },
    { name: 'AI Predictions', path: '/predictions', icon: BrainCircuit, roles: ['ADMIN', 'MAINTENANCE_MANAGER', 'EXECUTIVE'] },
  ];

  const filteredNavItems = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <aside 
      className={`bg-surface border-r border-border h-screen flex flex-col justify-between transition-all duration-300 relative select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header / Logo */}
      <div>
        <div className="flex items-center gap-3 p-6 border-b border-border h-[80px]">
          <div className="bg-primary/10 p-2 rounded-none border border-primary flex items-center justify-center">
            <Zap className="text-primary h-5 w-5 text-electric-glow" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-syne font-extrabold text-lg tracking-wider text-on-surface uppercase leading-none">
                PowerPulse
              </span>
              <span className="font-outfit text-xs text-primary font-medium tracking-widest mt-0.5">
                AI PLATFORM
              </span>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="mt-6 px-4 flex flex-col gap-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 font-outfit text-sm font-medium transition-all duration-200 border group ${
                    isActive
                      ? 'bg-primary/10 border-primary text-primary text-electric-glow'
                      : 'border-transparent text-text-muted hover:text-on-surface hover:bg-neutral'
                  }`
                }
              >
                <Icon size={18} className="shrink-0 transition-transform group-hover:scale-110" />
                {!collapsed && <span className="uppercase tracking-wider">{item.name}</span>}
                {collapsed && (
                  <div className="absolute left-20 bg-surface border border-border px-3 py-1 text-xs uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                    {item.name}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Info & Toggle */}
      <div>
        {user && (
          <div className="p-4 border-t border-b border-border flex items-center gap-3 bg-neutral/30">
            <div className="bg-border p-2 rounded-full flex items-center justify-center text-text-muted shrink-0 h-10 w-10">
              <User size={18} />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="font-outfit font-semibold text-sm text-on-surface truncate">
                  {user.fullName}
                </p>
                <p className="font-outfit text-xs text-text-muted truncate">
                  {user.role} • {user.zone}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="p-4 flex flex-col gap-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 w-full font-outfit text-sm font-medium border border-transparent text-text-muted hover:text-error hover:bg-error/5 transition-all duration-200 group"
          >
            <LogOut size={18} className="shrink-0 group-hover:translate-x-1 transition-transform" />
            {!collapsed && <span className="uppercase tracking-wider">Logout</span>}
          </button>

          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-[70px] bg-neutral border border-border hover:border-primary text-text-muted hover:text-primary p-1 rounded-full z-40 transition-colors"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
