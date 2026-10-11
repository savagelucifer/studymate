import { useCallback, useEffect, useState } from 'react';
import { Bell, BellRing, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { isToday, isTomorrow, parseISO, isPast } from 'date-fns';

const getPermission = () => {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission;
};

export default function NotificationManager() {
  const { tasks } = useAppContext();
  const [permission, setPermission] = useState(getPermission);
  const [dismissed, setDismissed] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const requestNotifications = useCallback(async () => {
    if (!('Notification' in window)) {
      setPermission('unsupported');
      return;
    }

    setRequesting(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') setDismissed(true);
    } catch {
      setPermission(Notification.permission);
    } finally {
      setRequesting(false);
    }
  }, []);

  useEffect(() => {
    if (permission !== 'granted' || typeof window === 'undefined') return;

    let notifiedTasks = [];
    try {
      notifiedTasks = JSON.parse(sessionStorage.getItem('notified-tasks') || '[]');
      if (!Array.isArray(notifiedTasks)) notifiedTasks = [];
    } catch {
      notifiedTasks = [];
    }

    let notificationSent = false;
    tasks.forEach(task => {
      if (task.completed || !task.dueDate || notifiedTasks.includes(task.id)) return;

      const date = parseISO(task.dueDate);
      let message = '';
      if (isPast(date) && !isToday(date)) {
        message = `Overdue: ${task.title}`;
      } else if (isToday(date)) {
        message = `Due Today: ${task.title}`;
      } else if (isTomorrow(date)) {
        message = `Due Tomorrow: ${task.title}`;
      }

      if (message) {
        new Notification('StudyMate Deadline Alert', {
          body: message,
          icon: '/favicon.svg'
        });
        notifiedTasks.push(task.id);
        notificationSent = true;
      }
    });

    if (notificationSent) {
      try {
        sessionStorage.setItem('notified-tasks', JSON.stringify(notifiedTasks));
      } catch {
        // Notifications still work if session storage is unavailable.
      }
    }
  }, [tasks, permission]);

  if (permission === 'granted' || dismissed) return null;

  return (
    <div className="fixed right-4 top-20 z-[60] w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-violet-200 bg-white p-4 shadow-xl shadow-violet-950/10 dark:border-violet-900 dark:bg-slate-900" role="dialog" aria-labelledby="notification-prompt-title">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
          {permission === 'unsupported' ? <AlertTriangle size={21} /> : <BellRing size={21} />}
        </div>
        <div className="min-w-0 flex-1">
          <h2 id="notification-prompt-title" className="font-semibold text-slate-900 dark:text-white">
            {permission === 'unsupported' ? 'Notifications not supported' : permission === 'denied' ? 'Notifications are blocked' : 'Never miss a deadline'}
          </h2>
          <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
            {permission === 'unsupported'
              ? 'This browser does not support desktop notifications. You can still see deadlines inside StudyMate.'
              : permission === 'denied'
                ? 'Notifications are blocked for this site. Allow them in your browser site settings to receive deadline reminders.'
                : 'Allow notifications for study reminders about tasks due today, tomorrow, and overdue assignments.'}
          </p>
        </div>
        <button type="button" aria-label="Dismiss notification prompt" onClick={() => setDismissed(true)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200">
          <X size={17} />
        </button>
      </div>
      {permission === 'default' && (
        <div className="mt-4 flex items-center justify-end gap-2">
          <button type="button" onClick={() => setDismissed(true)} className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            Not now
          </button>
          <button type="button" disabled={requesting} onClick={requestNotifications} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-wait disabled:opacity-60">
            <Bell size={15} /> {requesting ? 'Requesting…' : 'Allow notifications'}
          </button>
        </div>
      )}
      {permission === 'denied' && (
        <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
          <CheckCircle2 size={14} /> Change permission using the site controls beside the address bar.
        </div>
      )}
    </div>
  );
}
