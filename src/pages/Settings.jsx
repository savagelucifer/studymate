import React, { useState } from 'react';
import {
  UserRound, BookOpen, Clock3, CalendarDays, BellRing, Moon, Sun,
  Save, Info, Download, RotateCcw, ShieldCheck, CheckCircle2, Target, Sparkles
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';

const inputClass = 'mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-violet-500 dark:focus:ring-violet-950';

export default function Settings() {
  const { settings, updateSettings, tasks, subjects, timetable, studySessions } = useAppContext();
  const { isDark, toggleTheme } = useTheme();
  const [saved, setSaved] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateSettings({ [name]: type === 'checkbox' ? checked : type === 'number' ? (value === '' ? '' : Number(value)) : value });
    setSaved(false);
  };

  const toggleDay = (index) => {
    const days = settings.availableDays || [];
    const next = days.includes(index) ? days.filter(day => day !== index) : [...days, index].sort((a, b) => a - b);
    updateSettings({ availableDays: next });
    setSaved(false);
  };

  const exportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile: settings,
      tasks,
      subjects,
      timetable,
      studySessions
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'studymate-backup.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const resetPreferences = () => {
    updateSettings({
      dailyGoalMinutes: 120,
      availableDays: [1, 2, 3, 4, 5],
      preferredStartTime: '18:00',
      preferredEndTime: '22:00',
      reminderNotifications: true,
      weeklySummary: false,
      compactDashboard: false
    });
    setResetConfirm(false);
    setSaved(false);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-7 pb-10">
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-600 p-6 text-white shadow-lg shadow-violet-900/10 sm:p-8">
        <div className="absolute -right-8 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15"><UserRound size={27} /></div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-100">Your StudyMate account</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Profile & settings</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-violet-100">Make StudyMate feel like yours. Manage your profile, study routine, reminders, appearance, and data.</p>
          </div>
        </div>
        <div className="relative mt-6 flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">{tasks.length} tasks</span>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">{subjects.length} subjects</span>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">{studySessions.length} focus sessions</span>
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-charcoal sm:p-6">
          <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"><UserRound size={20} /></span><div><h2 className="font-bold text-slate-900 dark:text-white">Personal profile</h2><p className="text-xs text-slate-500 dark:text-slate-400">Personalize your workspace</p></div></div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Display name<input name="studentName" maxLength={60} value={settings.studentName || ''} onChange={handleChange} placeholder="What should we call you?" className={inputClass} /></label>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Your name appears in the greeting and profile avatar.</p>
          <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-500 text-lg font-bold text-white">{(settings.studentName || 'S').charAt(0).toUpperCase()}</div><div><p className="font-semibold text-slate-900 dark:text-white">{settings.studentName || 'Student'}</p><p className="text-xs text-slate-500 dark:text-slate-400">StudyMate learner</p></div></div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-charcoal sm:p-6">
          <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"><Target size={20} /></span><div><h2 className="font-bold text-slate-900 dark:text-white">Study goals</h2><p className="text-xs text-slate-500 dark:text-slate-400">Set a realistic daily target</p></div></div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Daily study goal (minutes)<input name="dailyGoalMinutes" type="number" min="30" max="1440" step="15" value={settings.dailyGoalMinutes ?? 120} onChange={handleChange} className={inputClass} /></label>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">That is about {Math.floor((Number(settings.dailyGoalMinutes) || 0) / 60)}h {(Number(settings.dailyGoalMinutes) || 0) % 60}m each day.</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Study starts<input type="time" name="preferredStartTime" value={settings.preferredStartTime || '18:00'} onChange={handleChange} className={inputClass} /></label>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Study ends<input type="time" name="preferredEndTime" value={settings.preferredEndTime || '22:00'} onChange={handleChange} className={inputClass} /></label>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-charcoal sm:p-6">
          <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"><CalendarDays size={20} /></span><div><h2 className="font-bold text-slate-900 dark:text-white">Available days</h2><p className="text-xs text-slate-500 dark:text-slate-400">Choose when you plan to study</p></div></div>
          <div className="flex flex-wrap gap-2">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => { const active = (settings.availableDays || []).includes(index); return <button key={day} type="button" aria-pressed={active} onClick={() => toggleDay(index)} className={'min-w-12 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ' + (active ? 'border-violet-600 bg-violet-600 text-white shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-violet-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300')}>{day}</button>; })}</div>
          <div className="mt-5 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300"><BookOpen size={16} className="mr-2 inline text-violet-500" />{(settings.availableDays || []).length} study days selected each week.</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-charcoal sm:p-6">
          <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"><BellRing size={20} /></span><div><h2 className="font-bold text-slate-900 dark:text-white">Reminders & preferences</h2><p className="text-xs text-slate-500 dark:text-slate-400">Choose how StudyMate behaves</p></div></div>
          {[{name:'reminderNotifications',title:'Deadline notifications',description:'Show browser reminders for tasks due today, tomorrow, or overdue.',fallback:true},{name:'weeklySummary',title:'Weekly study summary',description:'Keep a weekly review preference in your StudyMate settings.',fallback:false},{name:'compactDashboard',title:'Compact dashboard',description:'Save your preference for a denser dashboard layout.',fallback:false}].map(item => <label key={item.name} className="flex cursor-pointer items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-0 dark:border-slate-800"><span><span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</span><span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{item.description}</span></span><input type="checkbox" name={item.name} checked={settings[item.name] ?? item.fallback} onChange={handleChange} className="mt-1 h-4 w-4 accent-violet-600" /></label>)}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-charcoal sm:p-6">
          <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">{isDark ? <Moon size={20} /> : <Sun size={20} />}</span><div><h2 className="font-bold text-slate-900 dark:text-white">Appearance</h2><p className="text-xs text-slate-500 dark:text-slate-400">Choose a comfortable look</p></div></div>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700"><div><p className="font-semibold text-slate-800 dark:text-slate-100">{isDark ? 'Dark mode is on' : 'Light mode is on'}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Applies across the entire app and is remembered on this device.</p></div><button type="button" onClick={toggleTheme} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">{isDark ? <Sun size={16} /> : <Moon size={16} />}{isDark ? 'Use light' : 'Use dark'}</button></div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-charcoal sm:p-6">
          <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"><ShieldCheck size={20} /></span><div><h2 className="font-bold text-slate-900 dark:text-white">Your data</h2><p className="text-xs text-slate-500 dark:text-slate-400">Back up your local study information</p></div></div>
          <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-300">Export a backup of your profile, tasks, subjects, timetable, and study sessions as a JSON file.</p>
          <button type="button" onClick={exportData} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"><Download size={16} /> Export my data</button>
          <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800"><button type="button" onClick={() => setResetConfirm(true)} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"><RotateCcw size={15} /> Reset study preferences</button>{resetConfirm && <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 dark:border-rose-900 dark:bg-rose-950/20"><p className="text-sm text-rose-800 dark:text-rose-200">Reset goals, available days, and reminder preferences to defaults? Your tasks and study records will not be deleted.</p><div className="mt-3 flex gap-2"><button type="button" onClick={resetPreferences} className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700">Yes, reset preferences</button><button type="button" onClick={() => setResetConfirm(false)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 dark:border-rose-900 dark:text-rose-200">Cancel</button></div></div>}</div>
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-2xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-900 dark:bg-violet-950/20 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2 text-sm text-violet-900 dark:text-violet-200"><Info size={17} className="mt-0.5 shrink-0" /><span>Your settings are saved automatically on this device. You can still use the button to confirm you've finished editing.</span></div>
        <button type="button" onClick={() => { setSaved(true); window.setTimeout(() => setSaved(false), 2500); }} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"><Save size={16} /> {saved ? 'Preferences saved' : 'Done'}</button>
      </div>
      {saved && <p role="status" className="flex items-center justify-end gap-2 text-sm font-medium text-emerald-600"><CheckCircle2 size={16} /> Your preferences are up to date.</p>}
    </div>
  );
}
