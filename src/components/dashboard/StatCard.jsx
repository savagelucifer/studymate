import React from 'react';
import { Card, CardContent } from '../ui/Card';

export function StatCard({ title, value, icon: Icon, trend, trendLabel, colorClass }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</h3>
          </div>
          <div className={`p-3 rounded-xl ${colorClass}`}>
            <Icon size={24} />
          </div>
        </div>
        {(trend || trendLabel) && (
          <div className="mt-4 flex items-center text-sm">
            {trend && (
              <span className={`font-medium ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {trend}
              </span>
            )}
            {trendLabel && (
              <span className="text-slate-500 dark:text-slate-400 ml-2">{trendLabel}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
