import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Trash2, Clock, BookOpen, CalendarDays, Sparkles, Timer } from 'lucide-react';
import TimetableForm from '../components/planner/TimetableForm';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_LABELS = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' };

const getSubjectColor = (name = '') => {
  const colors = [
    { bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-900', dot: 'bg-violet-500' },
    { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-900', dot: 'bg-blue-500' },
    { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-900', dot: 'bg-emerald-500' },
    { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-900', dot: 'bg-amber-500' },
    { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-900', dot: 'bg-rose-500' },
    { bg: 'bg-cyan-50 dark:bg-cyan-950/40', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-900', dot: 'bg-cyan-500' },
    { bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40', text: 'text-fuchsia-700 dark:text-fuchsia-300', border: 'border-fuchsia-200 dark:border-fuchsia-900', dot: 'bg-fuchsia-500' },
    { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-900', dot: 'bg-orange-500' },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const formatTime = (time = '00:00') => {
  const [h, m] = time.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};
const getDuration = (start = '00:00', end = '00:00') => {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
};

export default function Planner() {
  const { timetable, deleteTimetableSlot } = useAppContext();
  const [addingDay, setAddingDay] = useState(null);
  const todayKey = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];

  const getDayMinutes = (day) => (timetable[day] || []).reduce((sum, slot) => sum + Math.max(0, getDuration(slot.startTime, slot.endTime)), 0);
  const getDayTotal = (day) => {
    const minutes = getDayMinutes(day);
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs ? (mins ? `${hrs}h ${mins}m` : `${hrs}h`) : `${mins}m`;
  };
  const weeklyTotal = DAYS.reduce((sum, day) => sum + getDayMinutes(day), 0);
  const totalSlots = DAYS.reduce((sum, day) => sum + (timetable[day] || []).length, 0);
  const weeklyHrs = Math.floor(weeklyTotal / 60);
  const weeklyMins = weeklyTotal % 60;

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 pb-8">
      <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-600 px-6 py-7 text-white shadow-lg shadow-violet-900/10 sm:px-8">
        <div className="pointer-events-none absolute -right-8 -top-16 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide"><Sparkles size={14} /> YOUR WEEK, WITH A PLAN</div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Study timetable</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-violet-100 sm:text-base">Make space for what matters. Add your study sessions and build a routine that works for you.</p>
          </div>
          <div className="flex items-center gap-4 self-start rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-sm sm:self-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15"><Clock size={22} /></div>
            <div><p className="text-xs font-medium text-violet-100">Planned this week</p><p className="mt-0.5 text-2xl font-bold">{weeklyHrs}<span className="ml-1 text-sm font-semibold text-violet-100">h</span> {weeklyMins > 0 && <span className="text-lg">{weeklyMins}m</span>}</p></div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-charcoal"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"><CalendarDays size={19} /></div><div><p className="text-xs font-medium text-slate-500 dark:text-slate-400">Sessions planned</p><p className="text-xl font-bold text-slate-900 dark:text-white">{totalSlots}</p></div></div>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-charcoal"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"><BookOpen size={19} /></div><div><p className="text-xs font-medium text-slate-500 dark:text-slate-400">Days with a plan</p><p className="text-xl font-bold text-slate-900 dark:text-white">{DAYS.filter(day => (timetable[day] || []).length > 0).length}<span className="ml-1 text-sm font-medium text-slate-400">/ 7</span></p></div></div>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-charcoal"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"><Timer size={19} /></div><div><p className="text-xs font-medium text-slate-500 dark:text-slate-400">Today's plan</p><p className="text-xl font-bold text-slate-900 dark:text-white">{getDayTotal(todayKey)}</p></div></div>
      </section>

      {totalSlots === 0 && <div className="flex flex-col items-start gap-4 rounded-2xl border border-dashed border-violet-300 bg-violet-50/70 p-5 dark:border-violet-900 dark:bg-violet-950/20 sm:flex-row sm:items-center">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm dark:bg-slate-800 dark:text-violet-300"><BookOpen size={23} /></div>
        <div className="flex-1"><h2 className="font-semibold text-slate-900 dark:text-white">Start with one study session</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Your timetable is a blank canvas. Add your first subject and time slot to begin building a routine.</p></div>
        <button onClick={() => setAddingDay(todayKey)} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"><Plus size={17} /> Add first session</button>
      </div>}

      <section>
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-lg font-bold text-slate-900 dark:text-white">Your weekly schedule</h2><p className="text-sm text-slate-500 dark:text-slate-400">Select any day to add or organize a session.</p></div><p className="text-xs text-slate-400">Today is highlighted in violet</p></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
          {DAYS.map(day => {
            const slots = [...(timetable[day] || [])].sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
            const isToday = day === todayKey;
            return <div key={day} className={'flex min-w-0 flex-col overflow-hidden rounded-2xl border transition hover:-translate-y-0.5 hover:shadow-md ' + (isToday ? 'border-violet-300 bg-white shadow-sm shadow-violet-100 dark:border-violet-800 dark:bg-charcoal dark:shadow-none' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-charcoal')}>
              <div className={'flex items-center justify-between gap-2 border-b px-4 py-3 ' + (isToday ? 'border-violet-100 bg-violet-50/80 dark:border-violet-900 dark:bg-violet-950/30' : 'border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40')}>
                <div><p className={'text-sm font-bold ' + (isToday ? 'text-violet-700 dark:text-violet-300' : 'text-slate-800 dark:text-slate-100')}>{DAY_LABELS[day]}</p><p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{slots.length ? getDayTotal(day) + ' planned' : 'Open schedule'}</p></div>
                {isToday && <span className="rounded-full bg-violet-600 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white">Today</span>}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-2.5">
                {slots.length ? slots.map(slot => {
                  const color = getSubjectColor(slot.subject);
                  const duration = getDuration(slot.startTime, slot.endTime);
                  return <div key={slot.id} className={'group relative rounded-xl border p-3 transition hover:shadow-sm ' + color.bg + ' ' + color.border}>
                    <div className="mb-2 flex items-start justify-between gap-1"><div className="flex min-w-0 items-center gap-2"><span className={'h-2 w-2 shrink-0 rounded-full ' + color.dot} /><p className={'truncate text-xs font-bold ' + color.text} title={slot.subject}>{slot.subject}</p></div><button type="button" onClick={() => deleteTimetableSlot(day, slot.id)} aria-label={'Remove ' + slot.subject + ' from ' + DAY_LABELS[day]} title="Remove session" className="shrink-0 rounded-md p-1 text-slate-400 opacity-100 transition hover:bg-white/80 hover:text-rose-600 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"><Trash2 size={13} /></button></div>
                    <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{formatTime(slot.startTime)}</p><p className="text-[11px] text-slate-500 dark:text-slate-400">to {formatTime(slot.endTime)}</p>
                    {duration > 0 && <div className="mt-2 border-t border-black/5 pt-2 text-[10px] font-medium text-slate-500 dark:border-white/10 dark:text-slate-400">{duration} min session</div>}
                  </div>;
                }) : <button type="button" onClick={() => setAddingDay(day)} className="flex min-h-[110px] flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-2 py-4 text-slate-400 transition hover:border-violet-300 hover:bg-violet-50/60 hover:text-violet-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-slate-700 dark:hover:border-violet-800 dark:hover:bg-violet-950/20 dark:hover:text-violet-300"><span className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800"><Plus size={16} /></span><span className="text-xs font-semibold">Add a session</span></button>}
                {slots.length > 0 && <button type="button" onClick={() => setAddingDay(day)} className="mt-auto flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-slate-500 transition hover:bg-violet-50 hover:text-violet-700 dark:text-slate-400 dark:hover:bg-violet-950/30 dark:hover:text-violet-300"><Plus size={14} /> Add session</button>}
              </div>
            </div>;
          })}
        </div>
      </section>
      {addingDay && <TimetableForm day={addingDay} onClose={() => setAddingDay(null)} />}
    </div>
  );
}
