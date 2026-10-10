import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { X } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { v4 as uuidv4 } from 'uuid';

export default function TaskForm({ onClose }) {
  const { subjects, addTask, addSubject } = useAppContext();
  
  const [task, setTask] = useState({
    title: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'Medium',
    type: 'Assignment',
    estimatedMinutes: 60
  });

  const [subjectName, setSubjectName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let finalSubjectId = null;
    if (subjectName.trim()) {
      const existing = subjects.find(s => s.name.toLowerCase() === subjectName.trim().toLowerCase());
      if (existing) {
        finalSubjectId = existing.id;
      } else {
        finalSubjectId = uuidv4();
        const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e', '#64748b'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        addSubject({ id: finalSubjectId, name: subjectName.trim(), color: randomColor });
      }
    }

    addTask({
      ...task,
      subjectId: finalSubjectId,
      dueDate: new Date(task.dueDate).toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Add New Task</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <X size={20} />
          </button>
        </div>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Task Title</label>
              <input 
                required
                autoFocus
                type="text"
                value={task.title}
                onChange={e => setTask({...task, title: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                placeholder="e.g. Finish Calculus Chapter 5"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <input 
                  type="text"
                  list="subjects-list"
                  value={subjectName}
                  onChange={e => setSubjectName(e.target.value)}
                  placeholder="e.g. Math"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                />
                <datalist id="subjects-list">
                  {subjects.map(s => <option key={s.id} value={s.name} />)}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                <select 
                  value={task.type}
                  onChange={e => setTask({...task, type: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                >
                  <option>Assignment</option>
                  <option>Exam</option>
                  <option>Project</option>
                  <option>Practical</option>
                  <option>Revision</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                <input 
                  type="date"
                  required
                  value={task.dueDate}
                  onChange={e => setTask({...task, dueDate: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                <select 
                  value={task.priority}
                  onChange={e => setTask({...task, priority: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Est. Time (minutes)</label>
              <input 
                type="number"
                min="5"
                step="5"
                value={task.estimatedMinutes}
                onChange={e => setTask({...task, estimatedMinutes: parseInt(e.target.value)})}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-violet"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2 font-medium text-white bg-accent-violet hover:bg-accent-violet/90 rounded-lg shadow-md transition-colors"
              >
                Save Task
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
