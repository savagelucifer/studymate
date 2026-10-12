import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { StatCard } from '../components/dashboard/StatCard';
import { CheckCircle2, Clock3, Flame, CalendarDays, Plus, AlertTriangle, Bell, ArrowUpRight, BookOpen, Target, Sparkles, Play, Zap, ChevronRight, Circle, Trophy } from 'lucide-react';
import { isToday, isThisWeek, parseISO, isPast, isTomorrow, differenceInCalendarDays, format, startOfDay, subDays, startOfWeek, addDays } from 'date-fns';
import TaskForm from '../components/tasks/TaskForm';

const panel = 'rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm shadow-slate-900/[0.03] dark:border-slate-800 dark:bg-slate-900/75';
const sectionTitle = 'text-base font-bold tracking-tight text-slate-900 dark:text-white';

export default function Dashboard() {
  const { tasks, studySessions, settings, toggleTask, subjects } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const todayTasks = tasks.filter(t => !t.completed && t.dueDate && isToday(parseISO(t.dueDate)));
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const thisWeekSessions = studySessions.filter(s => s.date && isThisWeek(parseISO(s.date)));
  const weeklyStudyMinutes = thisWeekSessions.reduce((sum, session) => sum + (Number(session.duration) || 0), 0);
  const weeklyStudyHours = (weeklyStudyMinutes / 60).toFixed(1);
  const goalMinutes = (Number(settings.dailyGoalMinutes) || 120) * 5;
  const weeklyGoalPercent = goalMinutes > 0 ? Math.min(100, Math.round((weeklyStudyMinutes / goalMinutes) * 100)) : 0;

  const studiedDays = new Set(studySessions.map(session => {
    const date = parseISO(session.date);
    return Number.isNaN(date.getTime()) ? null : format(date, 'yyyy-MM-dd');
  }).filter(Boolean));
  let streak = 0;
  let streakCursor = startOfDay(new Date());
  if (!studiedDays.has(format(streakCursor, 'yyyy-MM-dd'))) streakCursor = subDays(streakCursor, 1);
  while (studiedDays.has(format(streakCursor, 'yyyy-MM-dd'))) {
    streak += 1;
    streakCursor = subDays(streakCursor, 1);
  }

  const warningTasks = tasks.filter(t => !t.completed && t.dueDate && !dismissedAlerts.includes(t.id)).map(t => {
    const date = parseISO(t.dueDate);
    const daysLeft = differenceInCalendarDays(date, new Date());
    let urgency = null;
    if (isPast(date) && !isToday(date)) urgency = 'overdue';
    else if (isToday(date)) urgency = 'today';
    else if (isTomorrow(date)) urgency = 'tomorrow';
    else if (daysLeft <= 3) urgency = 'soon';
    return { ...t, urgency, daysLeft };
  }).filter(t => t.urgency).sort((a, b) => a.daysLeft - b.daysLeft);

  const upcomingTasks = tasks.filter(t => {
    if (t.completed || !t.dueDate) return false;
    const d = parseISO(t.dueDate);
    const diff = differenceInCalendarDays(d, new Date());
    return diff >= 0 && diff <= 7;
  }).sort((a, b) => parseISO(a.dueDate) - parseISO(b.dueDate)).slice(0, 4);

  const weekBars = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, index) => {
      const day = addDays(start, index);
      const minutes = thisWeekSessions.filter(session => {
        const date = parseISO(session.date);
        return !Number.isNaN(date.getTime()) && format(date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      }).reduce((sum, session) => sum + (Number(session.duration) || 0), 0);
      return { label: format(day, 'EEEEE'), full: format(day, 'EEEE'), minutes, today: isToday(day) };
    });
  }, [studySessions]);

  const dateLabel = format(new Date(), 'EEEE, MMMM d');
  const firstName = (settings.studentName || 'Student').trim().split(/\s+/)[0];
  const nextTask = upcomingTasks[0];
  const completedToday = tasks.filter(t => t.completed && t.dueDate && isToday(parseISO(t.dueDate))).length;

  return (
    <div className="mx-auto max-w-[1480px] space-y-6 pb-10">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#17122e] text-white shadow-2xl shadow-violet-950/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_82%_18%,rgba(168,85,247,0.55),transparent_34%),radial-gradient(ellipse_at_70%_110%,rgba(79,70,229,0.7),transparent_45%)]" />
        <div className="absolute right-[18%] top-[-7rem] h-72 w-72 rounded-full border border-white/10" />
        <div className="absolute right-[10%] top-[-4rem] h-56 w-56 rounded-full border border-white/10" />
        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.45fr_0.8fr] lg:items-center lg:p-10">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-violet-100"><Sparkles size={13} /> Your personal study space</div>
            <p className="text-sm font-medium text-violet-200">{dateLabel}</p>
            <h1 className="mt-2 max-w-3xl text-3xl font-extrabold leading-[1.08] tracking-[-0.04em] sm:text-4xl lg:text-[3.25rem]">Make room for your <span className="bg-gradient-to-r from-fuchsia-200 to-violet-300 bg-clip-text text-transparent">next big win.</span></h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Hey {firstName} — every focused session is progress. Pick one thing, start small, and build momentum.</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => setIsAdding(true)} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-violet-800 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-violet-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"><Plus size={17} /> Add a task</button>
              <Link to="/timer" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.08] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.14]"><Play size={16} /> Start focus session</Link>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-300">
              <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" /> {todayTasks.length} tasks due today</span>
              <span className="inline-flex items-center gap-2"><Flame size={14} className="text-orange-300" /> {streak} day streak</span>
              <span className="inline-flex items-center gap-2"><Clock3 size={14} className="text-violet-300" /> {weeklyStudyHours}h this week</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl sm:p-5">
              <div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-slate-300">Weekly study goal</span><Target size={17} className="text-violet-200" /></div>
              <div className="mt-3 flex items-end gap-2"><span className="text-3xl font-extrabold tracking-tight">{weeklyGoalPercent}%</span><span className="mb-1 text-xs text-slate-400">of target</span></div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-fuchsia-300 to-violet-300 transition-all duration-700" style={{ width: weeklyGoalPercent + '%' }} /></div>
              <div className="mt-2 flex justify-between text-[11px] text-slate-400"><span>{weeklyStudyHours} hours done</span><span>{(goalMinutes / 60).toFixed(0)}h goal</span></div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl sm:p-5">
              <div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-300">Your task momentum</span><Trophy size={17} className="text-amber-200" /></div>
              <div className="mt-3 flex items-baseline gap-2"><span className="text-3xl font-extrabold tracking-tight">{completedTasks}</span><span className="text-sm text-slate-400">of {totalTasks} completed</span></div>
              <div className="mt-4 flex gap-1.5">{Array.from({ length: Math.max(1, Math.min(totalTasks || 1, 12)) }, (_, i) => <span key={i} className={'h-1.5 flex-1 rounded-full ' + (i < completedTasks ? 'bg-emerald-300' : 'bg-white/15')} />)}</div>
              <p className="mt-2 text-[11px] text-slate-400">{totalTasks ? taskCompletionRate + '% complete — keep going.' : 'Add your first task to get started.'}</p>
            </div>
          </div>
        </div>
      </section>

      {isAdding && <TaskForm onClose={() => setIsAdding(false)} />}

      {warningTasks.length > 0 && <section aria-label="Deadline reminders" className="space-y-2">{warningTasks.slice(0, 2).map(task => {
        const styles = task.urgency === 'overdue' ? 'border-rose-200 bg-rose-50/90 dark:border-rose-900 dark:bg-rose-950/30' : task.urgency === 'today' ? 'border-orange-200 bg-orange-50/90 dark:border-orange-900 dark:bg-orange-950/25' : 'border-amber-200 bg-amber-50/90 dark:border-amber-900 dark:bg-amber-950/25';
        const ink = task.urgency === 'overdue' ? 'text-rose-700 dark:text-rose-300' : task.urgency === 'today' ? 'text-orange-700 dark:text-orange-300' : 'text-amber-700 dark:text-amber-300';
        const label = task.urgency === 'overdue' ? 'OVERDUE' : task.urgency === 'today' ? 'DUE TODAY' : task.urgency === 'tomorrow' ? 'DUE TOMORROW' : 'COMING UP';
        return <div key={task.id} className={'flex items-center gap-3 rounded-2xl border px-4 py-3 ' + styles}><div className={'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 dark:bg-slate-900/50 ' + ink}><AlertTriangle size={17} /></div><div className="min-w-0 flex-1"><p className={'text-[10px] font-extrabold tracking-[0.14em] ' + ink}>{label}</p><p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{task.title}</p></div><button type="button" onClick={() => setDismissedAlerts(current => [...current, task.id])} className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-white/70 dark:hover:bg-slate-800">Dismiss</button></div>;
      })}</section>}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <StatCard title="Tasks due today" value={todayTasks.length.toString()} icon={CalendarDays} colorClass="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300" trend={todayTasks.length ? todayTasks.length + ' waiting for you' : 'All caught up'} />
        <StatCard title="Study time this week" value={weeklyStudyHours + 'h'} icon={Clock3} colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300" trendLabel={'Goal: ' + (goalMinutes / 60).toFixed(0) + 'h'} />
        <StatCard title="Task completion" value={taskCompletionRate + '%'} icon={CheckCircle2} colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300" trendLabel={completedTasks + ' completed overall'} />
        <StatCard title="Current streak" value={streak + (streak === 1 ? ' day' : ' days')} icon={Flame} colorClass="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300" trend={streak > 0 ? 'You’re building momentum' : 'Start with 20 minutes'} />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className={panel + ' p-5 sm:p-6'}>
          <div className="mb-5 flex items-start justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-violet-600 dark:text-violet-300">Your day, simplified</p><h2 className={'mt-1 ' + sectionTitle}>Today's focus</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">One small step at a time.</p></div><Link to="/tasks" className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:text-violet-900 dark:text-violet-300">All tasks <ChevronRight size={14} /></Link></div>
          {todayTasks.length ? <div className="space-y-2">{todayTasks.slice(0, 5).map(task => {
            const subject = subjects.find(s => s.id === task.subjectId);
            return <div key={task.id} className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 transition hover:border-violet-200 hover:bg-violet-50/70 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-violet-900 dark:hover:bg-violet-950/20">
              <button type="button" onClick={() => toggleTask(task.id)} aria-label={'Mark ' + task.title + ' complete'} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 text-transparent transition hover:border-violet-500 hover:bg-violet-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"><CheckCircle2 size={15} /></button>
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{task.title}</p><p className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">{subject && <><span className="h-2 w-2 rounded-full" style={{ backgroundColor: subject.color }} />{subject.name}<span>·</span></>}{task.type || 'Study task'}</p></div>
              {task.priority && <span className={'rounded-full px-2.5 py-1 text-[10px] font-bold ' + (task.priority === 'Urgent' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' : 'bg-white text-slate-500 dark:bg-slate-800 dark:text-slate-300')}>{String(task.priority).toUpperCase()}</span>}
            </div>;
          })}</div> : <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-8 text-center dark:border-slate-800 dark:bg-slate-950/30"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"><CheckCircle2 size={24} /></div><h3 className="font-semibold text-slate-800 dark:text-slate-100">You're clear for today</h3><p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">No tasks due today. Add a small goal and make the time count.</p><button type="button" onClick={() => setIsAdding(true)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700"><Plus size={16} /> Create a task</button></div>}
        </div>

        <div className={panel + ' p-5 sm:p-6'}>
          <div className="mb-5 flex items-start justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-indigo-600 dark:text-indigo-300">On the horizon</p><h2 className={'mt-1 ' + sectionTitle}>Coming up</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Deadlines worth keeping in sight.</p></div><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"><CalendarDays size={19} /></div></div>
          {upcomingTasks.length ? <div className="space-y-1">{upcomingTasks.map(task => {
            const due = parseISO(task.dueDate); const diff = differenceInCalendarDays(due, new Date());
            const label = diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : format(due, 'EEE, MMM d');
            return <div key={task.id} className="flex items-center gap-3 rounded-2xl p-2.5 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"><div className={'flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl ' + (diff <= 1 ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300')}><span className="text-[9px] font-extrabold uppercase">{format(due, 'MMM')}</span><span className="text-sm font-extrabold leading-none">{format(due, 'd')}</span></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{task.title}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{label}</p></div><ArrowUpRight size={16} className="text-slate-300" /></div>;
          })}</div> : <div className="py-8 text-center"><div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800"><CalendarDays size={20} /></div><p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No deadlines soon</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Enjoy a little breathing room.</p></div>}
          <Link to="/tasks" className="mt-3 flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5 text-xs font-bold text-slate-600 transition hover:border-violet-200 hover:text-violet-700 dark:border-slate-800 dark:text-slate-300 dark:hover:border-violet-900 dark:hover:text-violet-300">Manage deadlines <ArrowUpRight size={14} /></Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className={panel + ' p-5 sm:p-6'}>
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-violet-600 dark:text-violet-300">Consistency over intensity</p><h2 className={'mt-1 ' + sectionTitle}>Your study rhythm</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A snapshot of your week so far.</p></div><span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">{weeklyGoalPercent}% of goal</span></div>
          <div className="flex h-36 items-end justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">{weekBars.map(day => {
            const max = Math.max(60, ...weekBars.map(item => item.minutes));
            const height = day.minutes ? Math.max(8, Math.round((day.minutes / max) * 100)) : 5;
            return <div key={day.full} className="flex h-full flex-1 flex-col items-center justify-end gap-2" title={day.full + ': ' + day.minutes + ' minutes'}><div className="flex h-full w-full items-end justify-center"><div className={'w-full max-w-9 rounded-t-xl transition-all duration-500 ' + (day.today ? 'bg-gradient-to-t from-violet-700 to-fuchsia-400 shadow-lg shadow-violet-500/20' : day.minutes ? 'bg-violet-200 dark:bg-violet-900' : 'bg-slate-100 dark:bg-slate-800')} style={{ height: height + '%' }} /></div><span className={'text-[11px] font-semibold ' + (day.today ? 'text-violet-700 dark:text-violet-300' : 'text-slate-400')}>{day.label}</span></div>;
          })}</div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-slate-500 dark:text-slate-400"><span className="font-bold text-slate-800 dark:text-slate-100">{weeklyStudyHours} hours</span> focused this week</p><Link to="/analytics" className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:text-violet-900 dark:text-violet-300">Explore analytics <ChevronRight size={14} /></Link></div>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-5 dark:border-violet-900/50 dark:from-violet-950/40 dark:via-slate-900 dark:to-indigo-950/30 sm:p-6">
          <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-violet-300/20 blur-3xl dark:bg-violet-600/10" />
          <div className="relative"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm dark:bg-slate-800 dark:text-violet-300"><Zap size={21} /></div><p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-violet-700 dark:text-violet-300">Your next move</p><h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">{nextTask ? 'Get ahead of a deadline' : 'Build a little momentum'}</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{nextTask ? 'Start with “' + nextTask.title + '”. A focused 25-minute session is a great first step.' : 'Pick one subject, set a 25-minute timer, and give it your full attention.'}</p><div className="mt-5 flex flex-wrap gap-2"><Link to="/timer" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-600/20 transition hover:-translate-y-0.5 hover:bg-violet-700"><Play size={15} /> Focus for 25 min</Link><Link to="/planner" className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white/80 px-4 py-2.5 text-sm font-bold text-violet-800 transition hover:bg-white dark:border-violet-900 dark:bg-slate-900/70 dark:text-violet-200"><CalendarDays size={15} /> View planner</Link></div><div className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400"><Circle size={7} className="fill-emerald-400 text-emerald-400" /> Start small. Stay consistent. You've got this.</div></div>
        </div>
      </section>
    </div>
  );
}
