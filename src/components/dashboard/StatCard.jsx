import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { ArrowUpRight } from 'lucide-react';

export function StatCard({ title, value, icon: Icon, trend, trendLabel, colorClass }) {
  const positive = trend && (trend.startsWith('+') || trend.toLowerCase().includes('caught') || trend.toLowerCase().includes('roll'));
  return (
    <Card className="group relative overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md dark:hover:border-violet-900">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-100" />
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">{value}</h3>
          </div>
          <div className={'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ' + colorClass}>
            <Icon size={21} strokeWidth={2.1} />
          </div>
        </div>
        {(trend || trendLabel) && <div className="mt-4 flex min-h-5 items-center gap-1.5 text-xs">
          {trend && <span className={'font-semibold ' + (positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300')}>{trend}</span>}
          {trendLabel && <span className="text-slate-500 dark:text-slate-400">{trendLabel}</span>}
          <ArrowUpRight size={13} className="ml-auto text-slate-300 transition group-hover:text-violet-500" />
        </div>}
      </CardContent>
    </Card>
  );
}
