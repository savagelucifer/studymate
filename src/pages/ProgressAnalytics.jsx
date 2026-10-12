import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { StatCard } from '../components/dashboard/StatCard';
import { Target, TrendingUp, Clock, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { addDays, format, isThisWeek, isToday, parseISO, startOfDay, startOfWeek, subDays } from 'date-fns';

const safeDate = (value) => {
  if (!value) return null;
  const date = typeof value === 'string' ? parseISO(value) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDuration = (minutes) => {
  const total = Math.max(0, Math.round(minutes));
  const hours = Math.floor(total / 60);
  const remainingMinutes = total % 60;
  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
};

export default function ProgressAnalytics() {
  const { studySessions, settings } = useAppContext();
  const sessions = Array.isArray(studySessions) ? studySessions : [];

  const weeklySessions = sessions.filter((session) => {
    const date = safeDate(session.date);
    return date && isThisWeek(date, { weekStartsOn: 1 });
  });

  const weeklyMinutes = weeklySessions.reduce((total, session) => total + (Number(session.duration) || 0), 0);
  const weeklyGoalMinutes = Math.max(1, (Number(settings.dailyGoalMinutes) || 120) * 5);
  const goalPercent = Math.min(100, Math.round((weeklyMinutes / weeklyGoalMinutes) * 100));

  const studiedDays = new Set(
    sessions
      .map((session) => safeDate(session.date))
      .filter(Boolean)
      .map((date) => format(date, 'yyyy-MM-dd'))
  );

  let streak = 0;
  let cursor = startOfDay(new Date());
  if (!studiedDays.has(format(cursor, 'yyyy-MM-dd'))) cursor = subDays(cursor, 1);
  while (studiedDays.has(format(cursor, 'yyyy-MM-dd'))) {
    streak += 1;
    cursor = subDays(cursor, 1);
  }

  const weeklyChartData = useMemo(() => {
    const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, index) => {
      const day = addDays(monday, index);
      const dayKey = format(day, 'yyyy-MM-dd');
      const minutes = sessions.reduce((total, session) => {
        const date = safeDate(session.date);
        return date && format(date, 'yyyy-MM-dd') === dayKey
          ? total + (Number(session.duration) || 0)
          : total;
      }, 0);
      return {
        name: format(day, 'EEE'),
        hours: Number((minutes / 60).toFixed(2)),
        today: isToday(day)
      };
    });
  }, [sessions]);

  const hasActivity = sessions.length > 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Progress & Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">Your study consistency and time, based on your recorded focus sessions.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Focus Time This Week"
          value={formatDuration(weeklyMinutes)}
          icon={Clock}
          colorClass="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
          trend={weeklyMinutes ? 'Recorded this week' : 'No study time yet'}
        />
        <StatCard
          title="Weekly Goal"
          value={`${goalPercent}%`}
          icon={Target}
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          trend={weeklyMinutes ? (goalPercent >= 100 ? 'Goal reached!' : 'Keep building') : 'Ready when you are'}
        />
        <StatCard
          title="Current Streak"
          value={`${streak} ${streak === 1 ? 'Day' : 'Days'}`}
          icon={TrendingUp}
          colorClass="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
          trend={streak ? 'Nice consistency' : 'Start your first streak'}
        />
        <StatCard
          title="Sessions Completed"
          value={String(sessions.length)}
          icon={Calendar}
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          trend={sessions.length ? 'All recorded sessions' : 'No sessions yet'}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Study Time (Hours)</CardTitle>
        </CardHeader>
        <CardContent>
          {hasActivity ? (
            <div className="mt-4 h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip
                    formatter={(value) => [`${value} hours`, 'Study time']}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#c4b5fd' }}
                  />
                  <Area type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-6 text-center dark:border-slate-700">
              <div className="mb-3 rounded-2xl bg-violet-100 p-3 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300">
                <Clock size={24} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Your progress starts here</h3>
              <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">Complete a focus session and save it to see your real study time, streak, and weekly chart. No sample activity is shown.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
