import React, { useState } from 'react';
import { Moon, Sun, Bell, Menu, UserRound, CalendarClock, CheckCircle2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, isPast, isToday, isTomorrow, parseISO } from 'date-fns';
import { useTheme } from '../../hooks/useTheme';
import { useAppContext } from '../../context/AppContext';

export default function Topbar({ onMenuClick }) {
  const { isDark, toggleTheme } = useTheme();
  const { settings, tasks } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const pendingTasks = tasks
    .filter(task => !task.completed && task.dueDate)
    .map(task => {
      const date = parseISO(task.dueDate);
      let label = format(date, 'MMM d');
      let priority = 'Upcoming';
      if (isPast(date) && !isToday(date)) priority = 'Overdue';
      else if (isToday(date)) priority = 'Due today';
      else if (isTomorrow(date)) priority = 'Due tomorrow';
      return { ...task, label, priority, date };
    })
    .sort((a, b) => a.date - b.date)
    .slice(0, 5);

  const goToTasks = () => {
    setNotificationsOpen(false);
    navigate('/tasks');
  };

  return (
    <header className="sticky top-0 z-20 flex h-[72px] shrink-0 items-center justify-between border-b border-white/70 bg-white/75 px-4 backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-950/75 sm:px-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMenuClick} aria-label="Open navigation" className="md:hidden rounded-lg p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet"><Menu size={21} /></button>
        <h2 className="hidden text-[15px] font-semibold tracking-tight text-slate-800 dark:text-slate-100 md:block">
          {getGreeting()}, {settings.studentName || 'Student'} 👋
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(open => !open)}
            aria-label="Open notifications"
            aria-expanded={notificationsOpen}
            title="Notifications"
            className="p-2 rounded-xl text-slate-500 hover:text-accent-violet hover:bg-violet-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet"
          >
            <Bell size={20} />
            {pendingTasks.length > 0 && <span className="absolute top-1.5 right-1.5 min-w-2 h-2 rounded-full bg-accent-violet ring-2 ring-white dark:ring-charcoal" />}
          </button>
          {notificationsOpen && (
            <>
              <button type="button" aria-label="Close notifications panel" className="fixed inset-0 z-30 cursor-default" onClick={() => setNotificationsOpen(false)} />
              <div className="absolute right-0 top-12 z-40 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <div><h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3><p className="text-xs text-slate-500 dark:text-slate-400">{pendingTasks.length ? `${pendingTasks.length} pending task reminder${pendingTasks.length === 1 ? '' : 's'}` : 'You are all caught up'}</p></div>
                  <Bell size={17} className="text-violet-500" />
                </div>
                {pendingTasks.length ? <div className="max-h-72 overflow-y-auto p-2">
                  {pendingTasks.map(task => <button key={task.id} type="button" onClick={goToTasks} className="flex w-full items-start gap-3 rounded-xl p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"><CalendarClock size={16} /></span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-800 dark:text-slate-100">{task.title}</span><span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{task.priority} · {task.label}</span></span>
                  </button>)}
                </div> : <div className="px-4 py-7 text-center"><span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300"><CheckCircle2 size={20} /></span><p className="text-sm font-medium text-slate-800 dark:text-slate-100">No pending reminders</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Tasks with due dates will appear here.</p></div>}
                <div className="border-t border-slate-100 p-2 dark:border-slate-800"><button type="button" onClick={goToTasks} className="w-full rounded-xl px-3 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950/30">View all tasks</button></div>
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          className="rounded-xl p-2 text-slate-500 hover:text-accent-violet hover:bg-violet-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          type="button"
          onClick={() => navigate('/settings')}
          aria-label="Open profile and settings"
          title={settings.studentName ? `${settings.studentName} — Profile and settings` : 'Profile and settings'}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-accent-violet to-accent-blue text-sm font-semibold text-white shadow-sm transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet focus-visible:ring-offset-2"
        >
          {settings.studentName ? settings.studentName.charAt(0).toUpperCase() : <UserRound size={16} />}
        </button>
      </div>
    </header>
  );
}
