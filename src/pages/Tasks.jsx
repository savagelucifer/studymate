import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent } from '../components/ui/Card';
import { format, parseISO, isPast, isToday, isTomorrow } from 'date-fns';
import { CheckCircle2, Circle, Clock, Tag, MoreVertical, Plus } from 'lucide-react';
import { cn } from '../utils/cn';
import TaskForm from '../components/tasks/TaskForm';

export default function Tasks() {
  const { tasks, toggleTask, subjects } = useAppContext();
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [isAdding, setIsAdding] = useState(false);

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400';
      case 'High': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Medium': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Low': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getDueDateLabel = (dateString) => {
    if (!dateString) return 'No date';
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return 'Overdue';
    return format(date, 'MMM d, yyyy');
  };

  const getDueDateColor = (dateString, completed) => {
    if (completed || !dateString) return 'text-slate-500';
    const date = parseISO(dateString);
    if (isPast(date) && !isToday(date)) return 'text-rose-500 font-medium';
    if (isToday(date)) return 'text-orange-500 font-medium';
    return 'text-slate-500';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Tasks</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your assignments, exams, and projects.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-accent-violet hover:bg-accent-violet/90 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shrink-0"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {isAdding && <TaskForm onClose={() => setIsAdding(false)} />}

      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-px">
        {['all', 'active', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors",
              filter === f 
                ? "border-accent-violet text-accent-violet dark:text-accent-lavender" 
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => {
            const subject = subjects.find(s => s.id === task.subjectId);
            return (
              <Card key={task.id} className={cn("transition-opacity", task.completed && "opacity-60")}>
                <CardContent className="p-4 flex items-start sm:items-center gap-4">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={cn(
                      "mt-1 sm:mt-0 shrink-0",
                      task.completed ? "text-emerald-500" : "text-slate-300 hover:text-accent-violet dark:text-slate-600"
                    )}
                  >
                    {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "font-semibold text-base mb-1 truncate",
                      task.completed ? "text-slate-500 line-through" : "text-slate-900 dark:text-slate-100"
                    )}>
                      {task.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      {subject && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }}></div>
                          <span>{subject.name}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <Tag size={14} />
                        <span>{task.type}</span>
                      </div>
                      
                      <div className={cn("flex items-center gap-1", getDueDateColor(task.dueDate, task.completed))}>
                        <Clock size={14} />
                        <span>{getDueDateLabel(task.dueDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full hidden sm:inline-block", getPriorityColor(task.priority))}>
                      {task.priority}
                    </span>
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="text-center py-16 bg-white dark:bg-charcoal rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
            <CheckCircle2 size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">No tasks found</h3>
            <p className="text-slate-500 dark:text-slate-400">
              {filter === 'completed' ? "You haven't completed any tasks yet." : "You're all caught up! Add a new task to get started."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
