import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Settings as SettingsIcon, Save, Info } from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings } = useAppContext();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    updateSettings({
      [name]: type === 'number' ? parseInt(value, 10) : value
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your profile and study preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon size={20} className="text-accent-violet" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
            <input 
              type="text"
              name="studentName"
              value={settings.studentName}
              onChange={handleChange}
              className="w-full max-w-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-violet"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon size={20} className="text-accent-blue" />
            Study Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Daily Study Goal (Minutes)</label>
            <input 
              type="number"
              name="dailyGoalMinutes"
              min="30"
              step="30"
              value={settings.dailyGoalMinutes}
              onChange={handleChange}
              className="w-full max-w-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-violet"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
              <Info size={14} /> This helps calculate your weekly goals on the dashboard.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preferred Start Time</label>
              <input 
                type="time"
                name="preferredStartTime"
                value={settings.preferredStartTime}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-violet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preferred End Time</label>
              <input 
                type="time"
                name="preferredEndTime"
                value={settings.preferredEndTime}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-violet"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Available Study Days</label>
            <div className="flex flex-wrap gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    const days = settings.availableDays || [];
                    const newDays = days.includes(index) ? days.filter(d => d !== index) : [...days, index].sort();
                    updateSettings({ availableDays: newDays });
                  }}
                  className={`w-12 h-12 rounded-lg font-medium text-sm transition-colors ${
                    (settings.availableDays || []).includes(index) 
                      ? 'bg-accent-violet text-white shadow-md shadow-accent-violet/20' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="pt-4 flex justify-end">
        <button 
          className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Save size={18} />
          Save Settings
        </button>
      </div>
    </div>
  );
}
