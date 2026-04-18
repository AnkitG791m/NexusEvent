import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, QrCode, Ticket, Utensils, MessagesSquare,
  LayoutDashboard, Settings, UserCircle, LogOut, Users,
  Activity, BookOpen
} from 'lucide-react';

/**
 * Sidebar navigation component
 * @param {Object} props
 * @param {'student'|'admin'} props.role
 * @param {Function} props.onLogout
 */
const Sidebar = ({ role, onLogout }) => {
  const isStudent = role === 'student';
  const links = isStudent ? [
    { name: 'Dashboard',   path: '/dashboard',      icon: <LayoutDashboard size={20} /> },
    { name: 'Gate Pass',   path: '/qr',             icon: <QrCode size={20} /> },
    { name: 'Seating',     path: '/seat',           icon: <Ticket size={20} /> },
    { name: 'Food / Swag', path: '/food',           icon: <Utensils size={20} /> },
    { name: 'EHSAAS QA',  path: '/ehsaas',         icon: <MessagesSquare size={20} /> },
    { name: 'Leaderboard', path: '/credit',         icon: <UserCircle size={20} /> },
    { name: 'Event Rules', path: '/rules',          icon: <BookOpen size={20} /> }
  ] : [
    { name: 'Command Center', path: '/admin/dashboard',  icon: <Activity size={20} /> },
    { name: 'Manage Events',  path: '/admin/events',     icon: <CalendarDays size={20} /> },
    { name: 'Live Check-ins', path: '/admin/attendance', icon: <Users size={20} /> },
    { name: 'Swag Batches',   path: '/admin/food',       icon: <Utensils size={20} /> },
    { name: 'Settings',       path: '/admin/settings',   icon: <Settings size={20} /> },
    { name: 'Guidelines',     path: '/admin/rules',      icon: <BookOpen size={20} /> }
  ];

  return (
    <aside
      role="navigation"
      aria-label="Main navigation"
      className="w-72 h-screen bg-white dark:bg-black/90 border-r border-slate-200 dark:border-cyber-border flex flex-col fixed left-0 top-0 z-50 transition-colors duration-300"
    >
      <div className="flex items-center gap-3 p-8 border-b border-slate-100 dark:border-cyber-border">
        <div className="p-2 bg-brand-500 rounded-xl shadow-md dark:bg-transparent dark:border dark:border-cyber-primary dark:shadow-[0_0_10px_rgba(0,240,255,0.3)] dark:rounded-none">
          <CalendarDays size={22} className="text-white dark:text-cyber-primary" />
        </div>
        <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white dark:font-mono">
          NEXUS<span className="text-brand-500 dark:text-cyber-primary">EVENT</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-1 p-6 overflow-y-auto">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 dark:text-cyber-primary/70 dark:font-mono">
          Workspace
        </div>
        {links.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            aria-label={`Navigate to ${item.name}`}
            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-brand-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-cyber-primary dark:hover:bg-cyber-primary/10 rounded-2xl dark:rounded-none transition-all font-semibold dark:font-mono group"
          >
            <span className="text-slate-400 group-hover:text-brand-500 dark:text-slate-500 dark:group-hover:text-cyber-primary transition-colors">
              {item.icon}
            </span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-100 dark:border-cyber-border">
        <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl dark:rounded-none bg-slate-50 dark:bg-cyber-darker border border-slate-100 dark:border-cyber-border/50">
          <div className="w-10 h-10 rounded-full dark:rounded-none bg-slate-200 dark:bg-cyber-primary/20 flex items-center justify-center dark:border dark:border-cyber-primary/50">
            <UserCircle size={20} className="text-slate-600 dark:text-cyber-primary" aria-hidden="true" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white capitalize">{role}</div>
            <div className="text-xs text-slate-500 font-mono dark:text-cyber-secondary">
              ID: {role === 'admin' ? 'ADM-99X' : 'STD-82B'}
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          aria-label="Sign out of NexusEvent"
          tabIndex={0}
          className="flex justify-between items-center px-5 py-3 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 rounded-2xl dark:rounded-none transition-all font-bold dark:font-mono group"
        >
          Sign Out
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
