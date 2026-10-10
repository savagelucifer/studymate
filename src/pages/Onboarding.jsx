import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export default function Onboarding() {
  const { settings, updateSettings } = useAppContext();
  const navigate = useNavigate();
  const [name, setName] = useState('');

  const handleComplete = (e) => {
    e.preventDefault();
    if (name.trim()) {
      updateSettings({ studentName: name.trim(), isFirstLaunch: false });
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex bg-gradient-to-br from-accent-violet to-accent-blue p-4 rounded-2xl text-white shadow-lg shadow-accent-violet/20 mb-6">
            <GraduationCap size={48} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome to StudyMate</h1>
          <p className="text-slate-500 dark:text-slate-400">Your premium smart study & deadline planner.</p>
        </div>

        <Card className="border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-200/20 dark:shadow-none bg-white/80 dark:bg-charcoal/80 backdrop-blur-xl">
          <CardContent className="p-8">
            <form onSubmit={handleComplete} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  What should we call you?
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul"
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-violet transition-shadow"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl py-3 font-medium flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
              >
                Get Started
                <ArrowRight size={18} />
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
