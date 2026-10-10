import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { StatCard } from '../components/dashboard/StatCard';
import { CheckCircle2, Clock, Flame, CalendarDays, Plus, AlertTriangle, Bell, ArrowUpRight, BookOpen, Target, Sparkles } from 'lucide-react';
import { isToday, isThisWeek, parseISO, isPast, isTomorrow, differenceInCalendarDays, format, startOfDay, subDays } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import TaskForm from '../components/tasks/TaskForm';

export default function Dashboard() {
  const { tasks, studySessions, settings, toggleTask, subjects } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const todayTasks = tasks.filter(t => !t.completed && t.dueDate && isToday(parseISO(t.dueDate)));
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const thisWeekSessions = studySessions.filter(s => s.date && isThisWeek(parseISO(s.date)));
  const weeklyStudyMinutes = thisWeekSessions.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0);
  const weeklyStudyHours = (weeklyStudyMinutes / 60).toFixed(1);
  const goalMinutes = (Number(settings.dailyGoalMinutes) || 0) * 5;
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

  const warningTasks = tasks
    .filter(t => !t.completed && t.dueDate && !dismissedAlerts.includes(t.id))
    .map(t => {
      const date = parseISO(t.dueDate);
      const daysLeft = differenceInCalendarDays(date, new Date());
      let urgency = null;
      if (isPast(date) && !isToday(date)) urgency = 'overdue';
      else if (isToday(date)) urgency = 'today';
      else if (isTomorrow(date)) urgency = 'tomorrow';
      else if (daysLeft <= 3) urgency = 'soon';
      return { ...t, urgency, daysLeft };
    })
    .filter(t => t.urgency)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const upcomingTasks = tasks
    .filter(t => {
      if (t.completed || !t.dueDate) return false;
      const d = parseISO(t.dueDate);
      const diff = differenceInCalendarDays(d, new Date());
      return diff >= 0 && diff <= 7;
    })
    .sort((a, b) => parseISO(a.dueDate) - parseISO(b.dueDate))
    .slice(0, 5);

  const urgencyConfig = {
    overdue: { bg: 'bg-rose-50 dark:bg-rose-950/30', border: 'border-rose-200 dark:border-rose-900', text: 'text-rose-700 dark:text-rose-300', icon: AlertTriangle, label: 'OVERDUE' },
    today: { bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-900', text: 'text-orange-700 dark:text-orange-300', icon: Bell, label: 'DUE TODAY' },
    tomorrow: { bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-900', text: 'text-amber-700 dark:text-amber-300', icon: Bell, label: 'DUE TOMORROW' },
    soon: { bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-900', text: 'text-blue-700 dark:text-blue-300', icon: Clock, label: 'COMING UP' },
  };

  const dateLabel = format(new Date(), 'EEEE, MMMM d');
  const firstName = (settings.studentName || 'Student').trim().split(/\s+/)[0];
  const nextTask = upcomingTasks[0];

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 pb-8">
      <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-600 px-6 py-7 text-white shadow-lg shadow-violet-900/10 sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-[-90px] right-[22%] h-52 w-52 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-violet-50">
              <Sparkles size={14} /> YOUR PERSONAL STUDY SPACE
            </div>
            <p className="mb-1 text-sm font-medium text-violet-100">{dateLabel}</p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Hey {firstName}, you’ve got this. <span aria-hidden="true">✦</span></h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-violet-100 sm:text-base">Small, focused sessions add up. Let’s make today count and keep your goals moving forward.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => setIsAdding(true)} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <Plus size={18} /> Add a task
              </button>
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white">
                <Flame size={17} /> {streak} day streak
              </div>
            </div>
          </div>
          <div className="grid min-w-[220px] grid-cols-2 gap-3 md:w-[270px] md:grid-cols-1">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between text-sm text-violet-100"><span>Weekly goal</span><Target size={17} /></div>
              <div className="mt-2 text-2xl font-bold">{weeklyGoalPercent}%</div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/20">
                <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: weeklyGoalPercent + '%' }} />
              </div>
              <p className="mt-2 text-xs text-violet-100">{weeklyStudyHours}h studied this week</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between text-sm text-violet-100"><span>Tasks completed</span><CheckCircle2 size={17} /></div>
              <div className="mt-2 text-2xl font-bold">{completedTasks}<span className="ml-1 text-sm font-medium text-violet-100">/ {totalTasks}</span></div>
              <p className="mt-2 text-xs text-violet-100">Keep the momentum going</p>
            </div>
          </div>
        </div>
      </section>

      {isAdding && <TaskForm onClose={() => setIsAdding(false)} />}

      {warningTasks.length > 0 && (
        <section aria-label="Deadline reminders" className="space-y-2">
          {warningTasks.slice(0, 3).map(task => {
            const config = urgencyConfig[task.urgency];
            const Icon = config.icon;
            return (
              <div key={task.id} className={'flex items-center gap-3 rounded-2xl border px-4 py-3 ' + config.bg + ' ' + config.border}>
                <div className={'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 dark:bg-slate-900/40 ' + config.text}><Icon size={17} /></div>
                <div className="min-w-0 flex-1">
                  <div className={'text-[10px] font-bold tracking-wider ' + config.text}>{config.label}</div>
                  <div className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{task.title}</div>
                </div>
                <button onClick={() => setDismissedAlerts(current => [...current, task.id])} className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-white/70 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-white">Dismiss</button>
              </div>
            );
          })}
        </section>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Tasks due today" value={todayTasks.length.toString()} icon={CalendarDays} colorClass="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300" trend={todayTasks.length ? todayTasks.length + ' pending' : 'All caught up'} />
        <StatCard title="Study time this week" value={weeklyStudyHours + 'h'} icon={Clock} colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300" trendLabel={'Goal: ' + (goalMinutes / 60).toFixed(0) + 'h'} />
        <StatCard title="Task completion" value={taskCompletionRate + '%'} icon={CheckCircle2} colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300" trendLabel={completedTasks + ' completed overall'} />
        <StatCard title="Current streak" value={streak + (streak === 1 ? ' day' : ' days')} icon={Flame} colorClass="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300" trend={streak > 0 ? 'You’re on a roll!' : 'Start a session today'} />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
            <div><CardTitle>Today’s focus</CardTitle><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A clear next step beats a perfect plan.</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"><Target size={19} /></div>
          </CardHeader>
          <CardContent>
            {todayTasks.length > 0 ? (
              <div className="space-y-2">
                {todayTasks.map(task => {
                  const subject = subjects.find(s => s.id === task.subjectId);
                  return <div key={task.id} className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 transition hover:border-violet-200 hover:bg-violet-50/50 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-violet-900 dark:hover:bg-violet-950/20">
                    <button type="button" onClick={() => toggleTask(task.id)} aria-label={'Mark ' + task.title + ' complete'} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 text-transparent transition hover:border-violet-500 hover:bg-violet-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"><CheckCircle2 size={15} /></button>
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{task.title}</p><div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">{subject && <><span className="h-2 w-2 rounded-full" style={{ backgroundColor: subject.color }} /><span>{subject.name}</span><span>·</span></>}<span>{task.type || 'Study task'}</span></div></div>
                    {task.priority === 'Urgent' && <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-bold text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">URGENT</span>}
                  </div>;
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-9 text-center dark:border-slate-800 dark:bg-slate-900/30">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"><CheckCircle2 size={24} /></div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">You’re clear for today</h3>
                <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">No tasks due today. Add a small study goal to make progress while you have the time.</p>
                <button onClick={() => setIsAdding(true)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"><Plus size={16} /> Create a task</button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
            <div><CardTitle>Coming up</CardTitle><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your next deadlines</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"><CalendarDays size={19} /></div>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length > 0 ? <div className="space-y-1">
              {upcomingTasks.map(task => {
                const dueDate = parseISO(task.dueDate);
                const diff = differenceInCalendarDays(dueDate, new Date());
                const label = diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : format(dueDate, 'EEE, MMM d');
                return <div key={task.id} className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <div className={'flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl ' + (diff <= 1 ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300')}><span className="text-[9px] font-bold uppercase">{format(dueDate, 'MMM')}</span><span className="text-sm font-bold leading-none">{format(dueDate, 'd')}</span></div>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{task.title}</p><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{label}</p></div>
                  <ArrowUpRight size={16} className="shrink-0 text-slate-300" />
                </div>;
              })}
            </div> : <div className="py-9 text-center"><div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800"><CalendarDays size={20} /></div><p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No deadlines soon</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Enjoy the breathing room.</p></div>}
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Weekly study progress</CardTitle><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Build consistency, one session at a time.</p></CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-4"><div><span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{weeklyStudyHours}</span><span className="ml-1 text-sm text-slate-500">hours</span></div><span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">{weeklyGoalPercent}% of goal</span></div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700" style={{ width: weeklyGoalPercent + '%' }} /></div>
            <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400"><span>0h</span><span>Weekly target: {(goalMinutes / 60).toFixed(0)}h</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Make the next session count</CardTitle><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A tiny plan makes it easier to begin.</p></CardHeader>
          <CardContent>
            <div className="flex items-start gap-4 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 p-4 dark:from-violet-950/30 dark:to-indigo-950/20">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm dark:bg-slate-800 dark:text-violet-300"><BookOpen size={21} /></div>
              <div className="min-w-0 flex-1"><p className="font-semibold text-slate-800 dark:text-slate-100">{nextTask ? 'Start with your next deadline' : 'Choose one subject to review'}</p><p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">{nextTask ? nextTask.title + ' is coming up. Try one focused 25-minute session.' : 'Pick one topic, set a 25-minute timer, and give it your full attention.'}</p></div>
            </div>
            <p className="mt-3 text-xs text-slate-400">Tip: short breaks between focused sessions help you reset.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
