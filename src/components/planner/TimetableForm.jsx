import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { X } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export default function TimetableForm({ day, onClose }) {
  const { addTimetableSlot } = useAppContext();
  
  const [slot, setSlot] = useState({
    subject: '',
    startTime: '09:00',
    endTime: '10:00'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (slot.subject.trim()) {
      addTimetableSlot(day, {
        subject: slot.subject.trim(),
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Add Slot to {day}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <X size={20} />
          </button>
        </div>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject / Activity</label>
              <input 
                required
                autoFocus
                type="text"
                value={slot.subject}
                onChange={e => setSlot({...slot, subject: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                placeholder="e.g. Physics Revision"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                <input 
                  type="time"
                  required
                  value={slot.startTime}
                  onChange={e => setSlot({...slot, startTime: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Time</label>
                <input 
                  type="time"
                  required
                  value={slot.endTime}
                  onChange={e => setSlot({...slot, endTime: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                />
              </div>
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
                Save
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
