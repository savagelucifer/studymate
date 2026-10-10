import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Trash2, Clock, BookOpen } from 'lucide-react';
import TimetableForm from '../components/planner/TimetableForm';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DAY_LABELS = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday'
};

// Assign a color based on subject name (consistent hashing)
const getSubjectColor = (name) => {
  const colors = [
    { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-300 dark:border-violet-700', dot: 'bg-violet-500' },
    { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700', dot: 'bg-blue-500' },
    { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-700', dot: 'bg-emerald-500' },
    { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-700', dot: 'bg-amber-500' },
    { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-300 dark:border-rose-700', dot: 'bg-rose-500' },
    { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-300 dark:border-cyan-700', dot: 'bg-cyan-500' },
    { bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30', text: 'text-fuchsia-700 dark:text-fuchsia-300', border: 'border-fuchsia-300 dark:border-fuchsia-700', dot: 'bg-fuchsia-500' },
    { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-300 dark:border-orange-700', dot: 'bg-orange-500' },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Format "14:30" → "2:30 PM"
const formatTime = (time) => {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
};

// Calculate duration in minutes between two HH:MM strings
const getDuration = (start, end) => {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
};

export default function Planner() {
  const { timetable, deleteTimetableSlot } = useAppContext();
  const [addingDay, setAddingDay] = useState(null);

  // Determine current day abbreviation
  const todayIndex = new Date().getDay(); // 0=Sun
  const todayKey = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][todayIndex];

  // Calculate total study hours per day
  const getDayTotal = (day) => {
    const slots = timetable[day] || [];
    const totalMin = slots.reduce((sum, s) => sum + Math.max(0, getDuration(s.startTime, s.endTime)), 0);
    const hrs = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    if (hrs === 0) return `${mins}m`;
    if (mins === 0) return `${hrs}h`;
    return `${hrs}h ${mins}m`;
  };

  // Total weekly hours
  const weeklyTotal = DAYS.reduce((sum, day) => {
    const slots = timetable[day] || [];
    return sum + slots.reduce((s, slot) => s + Math.max(0, getDuration(slot.startTime, slot.endTime)), 0);
  }, 0);
  const weeklyHrs = Math.floor(weeklyTotal / 60);
  const weeklyMins = weeklyTotal % 60;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Study Timetable</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Build your weekly study schedule — add subjects, set timings, and stay organized.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2.5">
          <Clock size={18} className="text-accent-violet" />
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Weekly Total</div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {weeklyHrs}h {weeklyMins > 0 ? `${weeklyMins}m` : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {DAYS.map((day) => {
          const slots = timetable[day] || [];
          const isToday = day === todayKey;

          return (
            <div key={day} className="flex flex-col">
              {/* Day Header */}
              <div className={`text-center p-3 rounded-t-xl font-semibold border-b-2 transition-colors ${
                isToday 
                  ? 'bg-accent-violet/10 text-accent-violet border-accent-violet dark:text-accent-lavender' 
                  : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-transparent'
              }`}>
                <div>{day}</div>
                {slots.length > 0 && (
                  <div className="text-[10px] font-normal opacity-60 mt-0.5">{getDayTotal(day)}</div>
                )}
              </div>

              {/* Slots */}
              <div className={`flex-1 p-2.5 rounded-b-xl border border-t-0 space-y-2 min-h-[140px] transition-colors ${
                isToday 
                  ? 'bg-white dark:bg-charcoal border-slate-200 dark:border-slate-700' 
                  : 'bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800'
              }`}>
                {slots.length > 0 ? (
                  slots.map(slot => {
                    const color = getSubjectColor(slot.subject);
                    const duration = getDuration(slot.startTime, slot.endTime);
                    return (
                      <div 
                        key={slot.id}
                        className={`group relative p-2.5 rounded-lg border ${color.bg} ${color.border} transition-all hover:shadow-sm`}
                      >
                        <button
                          onClick={() => deleteTimetableSlot(day, slot.id)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                          title="Remove"
                        >
                          <Trash2 size={10} />
                        </button>
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${color.dot}`}></div>
                          <div className={`font-semibold text-xs truncate ${color.text}`} title={slot.subject}>
                            {slot.subject}
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                        </div>
                        {duration > 0 && (
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{duration} min</div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 py-4">
                    <BookOpen size={18} className="mb-1 opacity-40" />
                    <span className="text-[11px]">No slots</span>
                  </div>
                )}

                {/* Add Slot Button */}
                <button
                  onClick={() => setAddingDay(day)}
                  className="w-full mt-1 py-1.5 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 hover:border-accent-violet hover:text-accent-violet dark:hover:border-accent-violet dark:hover:text-accent-violet transition-colors flex items-center justify-center gap-1 text-xs font-medium"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Slot Modal */}
      {addingDay && (
        <TimetableForm day={addingDay} onClose={() => setAddingDay(null)} />
      )}
    </div>
  );
}
