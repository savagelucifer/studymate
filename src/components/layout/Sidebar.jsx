import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, CalendarDays, BookOpen, Clock3, ChartNoAxesCombined, Settings, GraduationCap, Sparkles, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/tasks', label: 'My tasks', icon: CheckSquare },
  { path: '/planner', label: 'Study planner', icon: CalendarDays },
  { path: '/subjects', label: 'Subjects', icon: BookOpen },
  { path: '/timer', label: 'Focus room', icon: Clock3 },
  { path: '/analytics', label: 'Your progress', icon: ChartNoAxesCombined },
];

export default function Sidebar({ onNavigate }) {
  return (
    <aside className="relative flex h-full flex-col overflow-hidden border-r border-white/70 bg-white/85 text-slate-900 backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-950/90 dark:text-white">
      <div className="pointer-events-none absolute -left-20 top-12 h-48 w-48 rounded-full bg-violet-400/10 blur-3xl" />
      <div className="relative px-5 pb-7 pt-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/25 ring-1 ring-white/30">
            <GraduationCap size={25} strokeWidth={2.2} />
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400 dark:border-slate-950" />
          </div>
          <div className="min-w-0">
            <p className="text-[17px] font-extrabold tracking-tight">StudyMate<span className="text-violet-600">.</span></p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.19em] text-slate-400 dark:text-slate-500">Your study universe</p>
          </div>
        </div>
      </div>

      <div className="relative px-5 pb-2 pt-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Workspace</div>
      <nav aria-label="Main navigation" className="relative flex-1 space-y-1 px-3">
        {navItems.map((item, index) => (
          <NavLink key={item.path} to={item.path} onClick={onNavigate}
            className={({ isActive }) => cn(
              'group relative flex items-center gap-3 overflow-hidden rounded-2xl px-3.5 py-3 text-[13px] font-semibold transition-all duration-200',
              isActive
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/20'
                : 'text-slate-500 hover:bg-violet-50 hover:text-violet-700 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-violet-300'
            )}>
            <item.icon size={18} strokeWidth={2} className="shrink-0" />
            <span className="flex-1">{item.label}</span>
            <ChevronRight size={14} className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-60" />
          </NavLink>
        ))}
      </nav>

      <div className="relative mt-5 px-3 pb-3">
        <div className="mb-3 overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-4 dark:border-violet-900/50 dark:from-violet-950/50 dark:via-slate-900 dark:to-indigo-950/40">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm dark:bg-slate-800 dark:text-violet-300"><Sparkles size={16} /></div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Little steps. Big wins.</p>
          <p className="mt-1 text-[11px] leading-4 text-slate-500 dark:text-slate-400">A focused 20 minutes still counts.</p>
        </div>
        <NavLink to="/settings" onClick={onNavigate} className={({ isActive }) => cn(
          'flex items-center gap-3 rounded-2xl px-3.5 py-3 text-[13px] font-semibold transition-colors',
          isActive ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
        )}>
          <Settings size={18} /><span className="flex-1">Settings</span><ChevronRight size={14} className="opacity-50" />
        </NavLink>
        <p className="px-3 pb-1 pt-4 text-[10px] font-medium text-slate-400 dark:text-slate-600">MADE FOR YOUR NEXT BIG THING ✦</p>
      </div>
    </aside>
  );
}
