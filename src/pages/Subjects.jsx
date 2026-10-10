import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent } from '../components/ui/Card';
import { Plus, MoreVertical, BookOpen, Trash2, Edit2 } from 'lucide-react';

export default function Subjects() {
  const { subjects, addSubject, deleteSubject, tasks } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', color: '#8b5cf6' });

  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', 
    '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e', '#64748b'
  ];

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (newSubject.name.trim()) {
      addSubject(newSubject);
      setNewSubject({ name: '', color: '#8b5cf6' });
      setIsAdding(false);
    }
  };

  const getSubjectStats = (subjectId) => {
    const subjectTasks = tasks.filter(t => t.subjectId === subjectId);
    const completed = subjectTasks.filter(t => t.completed).length;
    return {
      total: subjectTasks.length,
      completed,
      pending: subjectTasks.length - completed
    };
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Subjects</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your courses and see subject-specific progress.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-accent-violet hover:bg-accent-violet/90 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shrink-0"
        >
          <Plus size={20} />
          Add Subject
        </button>
      </div>

      {isAdding && (
        <Card className="border-accent-violet dark:border-accent-violet/50 shadow-md">
          <CardContent className="p-6">
            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject Name</label>
                <input 
                  type="text"
                  autoFocus
                  required
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  placeholder="e.g. Data Structures"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject Color</label>
                <div className="flex flex-wrap gap-3">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewSubject({ ...newSubject, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${newSubject.color === color ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent hover:scale-110'}`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-accent-violet hover:bg-accent-violet/90 rounded-lg transition-colors"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(subject => {
          const stats = getSubjectStats(subject.id);
          return (
            <Card key={subject.id} className="group hover:shadow-md transition-shadow relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 w-full h-1" 
                style={{ backgroundColor: subject.color }}
              ></div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: subject.color }}
                    >
                      <BookOpen size={20} />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{subject.name}</h3>
                  </div>
                  <button 
                    onClick={() => {
                      if(window.confirm(`Delete ${subject.name}?`)) deleteSubject(subject.id);
                    }}
                    className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title="Delete subject"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider mb-1">Tasks</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider mb-1">Pending</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
