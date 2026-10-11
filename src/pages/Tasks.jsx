import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent } from '../components/ui/Card';
import { format, parseISO, isPast, isToday, isTomorrow } from 'date-fns';
import { CheckCircle2, Circle, Clock, Tag, MoreVertical, Plus, Pencil, Trash2 } from 'lucide-react';
import { cn } from '../utils/cn';
import TaskForm from '../components/tasks/TaskForm';

export default function Tasks() {
  const { tasks, toggleTask, deleteTask, subjects } = useAppContext();
  const [filter, setFilter] = useState('all');
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

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
    if (Number.isNaN(date.getTime())) return 'No date';
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return 'Overdue';
    return format(date, 'MMM d, yyyy');
  };

  const getDueDateColor = (dateString, completed) => {
    if (completed || !dateString) return 'text-slate-500';
    const date = parseISO(dateString);
    if (Number.isNaN(date.getTime())) return 'text-slate-500';
    if (isPast(date) && !isToday(date)) return 'text-rose-500 font-medium';
    if (isToday(date)) return 'text-orange-500 font-medium';
    return 'text-slate-500';
  };

  const handleDelete = (task) => {
    setOpenMenuId(null);
    if (window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      deleteTask(task.id);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Tasks</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your assignments, exams, and projects.</p>
        </div>
        <button
          type="button"
          onClick={() => { setEditingTask(null); setIsAdding(true); }}
          className="bg-accent-violet hover:bg-accent-violet/90 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shrink-0"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {isAdding && <TaskForm onClose={() => setIsAdding(false)} />}
      {editingTask && <TaskForm taskToEdit={editingTask} onClose={() => setEditingTask(null)} />}

      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-px">
        {['all', 'active', 'completed'].map(f => (
          <button
            type="button"
            key={f}
            onClick={() => { setFilter(f); setOpenMenuId(null); }}
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
            const menuOpen = openMenuId === task.id;
            return (
              <Card key={task.id} className={cn("transition-opacity", task.completed && "opacity-60")}>
                <CardContent className="p-4 flex items-start sm:items-center gap-4">
                  <button
                    type="button"
                    aria-label={task.completed ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}
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
                    <div className="relative">
                      <button
                        type="button"
                        aria-label={`Actions for ${task.title}`}
                        aria-haspopup="menu"
                        aria-expanded={menuOpen}
                        onClick={() => setOpenMenuId(menuOpen ? null : task.id)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700/70 rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-violet"
                      >
                        <MoreVertical size={20} />
                      </button>
                      {menuOpen && (
                        <div role="menu" className="absolute right-0 top-full mt-1 z-30 min-w-40 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl p-1">
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => { setEditingTask(task); setIsAdding(false); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Pencil size={16} /> Edit task
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => handleDelete(task)}
                            className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 size={16} /> Delete task
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
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
