import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { StatCard } from '../components/dashboard/StatCard';
import { Target, TrendingUp, Clock, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProgressAnalytics() {
  const { studySessions, settings } = useAppContext();

  // Mock data for charts
  const data = [
    { name: 'Mon', hours: 1.5 },
    { name: 'Tue', hours: 2.0 },
    { name: 'Wed', hours: 1.0 },
    { name: 'Thu', hours: 3.5 },
    { name: 'Fri', hours: 2.5 },
    { name: 'Sat', hours: 4.0 },
    { name: 'Sun', hours: 1.5 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Progress & Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">Track your study consistency and time over time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Focus Time"
          value="16h 30m"
          icon={Clock}
          colorClass="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
          trend="This week"
        />
        <StatCard
          title="Goal Completion"
          value="85%"
          icon={Target}
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          trend="On track"
        />
        <StatCard
          title="Current Streak"
          value="5 Days"
          icon={TrendingUp}
          colorClass="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
          trend="Keep going!"
        />
        <StatCard
          title="Sessions Completed"
          value="14"
          icon={Calendar}
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Study Time (Hours)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#c4b5fd' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
