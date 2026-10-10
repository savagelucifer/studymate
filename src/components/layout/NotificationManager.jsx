import { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { isToday, isTomorrow, parseISO, isPast } from 'date-fns';

export default function NotificationManager() {
  const { tasks } = useAppContext();

  useEffect(() => {
    // We only ask for permission if the user has tasks that need notifying, 
    // or just ask proactively. Let's wait a bit after load.
    const timer = setTimeout(() => {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }

      if (Notification.permission === 'granted') {
        const notifiedTasks = JSON.parse(sessionStorage.getItem('notified-tasks') || '[]');
        
        let notificationSent = false;
        tasks.forEach(task => {
          if (!task.completed && task.dueDate && !notifiedTasks.includes(task.id)) {
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
          }
        });
        
        if (notificationSent) {
          sessionStorage.setItem('notified-tasks', JSON.stringify(notifiedTasks));
        }
      }
    }, 2000); // Wait 2s after app load

    return () => clearTimeout(timer);
  }, [tasks]);

  return null;
}
