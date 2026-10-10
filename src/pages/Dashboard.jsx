import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { StatCard } from '../components/dashboard/StatCard';
import { CheckCircle2, Clock, Flame, Calendar as CalendarIcon, Plus, AlertTriangle, Bell } from 'lucide-react';
import { isToday, isThisWeek, parseISO, isPast, isTomorrow, differenceInDays, format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import TaskForm from '../components/tasks/TaskForm';

export default function Dashboard() {
  const { tasks, studySessions, settings } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const todayTasks = tasks.filter(t => !t.completed && t.dueDate && isToday(parseISO(t.dueDate)));
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const thisWeekSessions = studySessions.filter(s => isThisWeek(parseISO(s.date)));
  const weeklyStudyMinutes = thisWeekSessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const weeklyStudyHours = (weeklyStudyMinutes / 60).toFixed(1);

  const streak = 1;

  // Deadline warning tasks: overdue, today, or tomorrow
  const warningTasks = tasks
    .filter(t => !t.completed && t.dueDate && !dismissedAlerts.includes(t.id))
    .map(t => {
      const date = parseISO(t.dueDate);
      const daysLeft = differenceInDays(date, new Date());
      let urgency = null;
      if (isPast(date) && !isToday(date)) urgency = 'overdue';
      else if (isToday(date)) urgency = 'today';
      else if (isTomorrow(date)) urgency = 'tomorrow';
      else if (daysLeft <= 3) urgency = 'soon';
      return { ...t, urgency, daysLeft };
    })
    .filter(t => t.urgency)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  // Upcoming deadlines (next 7 days, not completed)
  const upcomingTasks = tasks
    .filter(t => {
      if (t.completed || !t.dueDate) return false;
      const d = parseISO(t.dueDate);
      const diff = differenceInDays(d, new Date());
      return diff >= 0 && diff <= 7;
    })
    .sort((a, b) => parseISO(a.dueDate) - parseISO(b.dueDate))
    .slice(0, 5);

  const urgencyConfig = {
    overdue: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-400', icon: AlertTriangle, label: 'OVERDUE' },
    today: { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-400', icon: Bell, label: 'DUE TODAY' },
    tomorrow: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-400', icon: Bell, label: 'DUE TOMORROW' },
    soon: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-400', icon: Clock, label: 'COMING UP' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Welcome back, {settings.studentName || 'Student'}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Here's what's happening with your studies today.
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-accent-violet hover:bg-accent-violet/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>

      {isAdding && <TaskForm onClose={() => setIsAdding(false)} />}

      {/* Deadline Warning Banners */}
      {warningTasks.length > 0 && (
        <div className="space-y-2">
          {warningTasks.slice(0, 3).map(task => {
            const config = urgencyConfig[task.urgency];
            const Icon = config.icon;
            return (
              <div 
                key={task.id} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${config.bg} ${config.border} transition-all`}
              >
                <Icon size={18} className={config.text} />
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-bold tracking-wider ${config.text} mr-2`}>{config.label}</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{task.title}</span>
                </div>
                <button 
                  onClick={() => setDismissedAlerts([...dismissedAlerts, task.id])}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 shrink-0 font-medium"
                >
                  Dismiss
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tasks Due Today"
          value={todayTasks.length.toString()}
          icon={CalendarIcon}
          colorClass="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
          trend={todayTasks.length > 0 ? `${todayTasks.length} pending` : "All caught up"}
        />
        <StatCard
          title="Weekly Study Time"
          value={`${weeklyStudyHours}h`}
          icon={Clock}
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          trendLabel={`Goal: ${settings.dailyGoalMinutes * 5 / 60}h`}
        />
        <StatCard
          title="Task Completion"
          value={`${taskCompletionRate}%`}
          icon={CheckCircle2}
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          trend={`+${completedTasks}`}
          trendLabel="completed overall"
        />
        <StatCard
          title="Current Streak"
          value={`${streak} days`}
          icon={Flame}
          colorClass="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
          trend="Keep it up!"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Today's Priorities</CardTitle>
          </CardHeader>
          <CardContent>
            {todayTasks.length > 0 ? (
              <div className="space-y-3">
                {todayTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-slate-100">{task.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{task.type}</p>
                    </div>
                    {task.priority === 'Urgent' && (
                      <span className="text-xs font-medium px-2 py-1 rounded bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                        Urgent
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle2 size={32} className="text-slate-400" />
                </div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100">All caught up!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">No tasks due today.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map(task => {
                  const dueDate = parseISO(task.dueDate);
                  const diff = differenceInDays(dueDate, new Date());
                  let label = format(dueDate, 'MMM d');
                  if (diff === 0) label = 'Today';
                  else if (diff === 1) label = 'Tomorrow';
                  else label = `In ${diff} days`;

                  return (
                    <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${diff <= 1 ? 'bg-red-500' : diff <= 3 ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{task.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No upcoming deadlines this week 🎉</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
