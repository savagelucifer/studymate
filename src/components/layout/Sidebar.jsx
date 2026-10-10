import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Calendar, BookOpen, Clock, BarChart2, Settings, GraduationCap } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tasks', label: 'My Tasks', icon: CheckSquare },
  { path: '/planner', label: 'Study Planner', icon: Calendar },
  { path: '/subjects', label: 'Subjects', icon: BookOpen },
  { path: '/timer', label: 'Focus Timer', icon: Clock },
  { path: '/analytics', label: 'Progress & Analytics', icon: BarChart2 },
];

export default function Sidebar({ onNavigate }) {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-charcoal border-r border-slate-200 dark:border-slate-800">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-gradient-to-br from-accent-violet to-accent-blue p-2 rounded-xl text-white">
          <GraduationCap size={24} />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">StudyMate</span>
      </div>
      
      <nav className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200',
                isActive
                  ? 'bg-accent-violet/10 text-accent-violet dark:text-accent-lavender'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <NavLink
          to="/settings"
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200',
              isActive
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
            )
          }
        >
          <Settings size={18} />
          Settings
        </NavLink>
      </div>
    </div>
  );
}
