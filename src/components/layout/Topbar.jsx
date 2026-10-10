import React from 'react';
import { Moon, Sun, Bell } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAppContext } from '../../context/AppContext';

export default function Topbar() {
  const { isDark, toggleTheme } = useTheme();
  const { settings } = useAppContext();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-charcoal flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 hidden md:block">
          {getGreeting()}, {settings.studentName || 'Student'} 👋
        </h2>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-violet rounded-full"></span>
        </button>
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-violet to-accent-blue flex items-center justify-center text-white font-medium text-sm shadow-sm">
          {settings.studentName ? settings.studentName.charAt(0).toUpperCase() : 'S'}
        </div>
      </div>
    </header>
  );
}
