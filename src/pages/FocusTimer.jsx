import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent } from '../components/ui/Card';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { cn } from '../utils/cn';
import { v4 as uuidv4 } from 'uuid';

export default function FocusTimer() {
  const { subjects, addStudySession, addSubject } = useAppContext();
  
  const [mode, setMode] = useState('focus'); // focus, shortBreak, longBreak
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  
  const modes = {
    focus: { label: 'Focus', minutes: 25, icon: Brain, color: 'text-accent-violet' },
    shortBreak: { label: 'Short Break', minutes: 5, icon: Coffee, color: 'text-emerald-500' },
    longBreak: { label: 'Long Break', minutes: 15, icon: Coffee, color: 'text-blue-500' }
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].minutes * 60);
  };

  const changeMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(modes[newMode].minutes * 60);
  };

  const handleSessionComplete = () => {
    if (mode === 'focus') {
      const confirm = window.confirm("Session complete! Did you stay focused?");
      if (confirm) {
        let finalSubjectId = null;
        if (selectedSubject.trim()) {
          const existing = subjects.find(s => s.name.toLowerCase() === selectedSubject.trim().toLowerCase());
          if (existing) {
            finalSubjectId = existing.id;
          } else {
            finalSubjectId = uuidv4();
            const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e', '#64748b'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            addSubject({ id: finalSubjectId, name: selectedSubject.trim(), color: randomColor });
          }
        }
        
        addStudySession({
          duration: modes.focus.minutes,
          subjectId: finalSubjectId,
          type: 'focus'
        });
      }
    } else {
      // Break over
      const audio = new Audio('/break-over.mp3'); // Mock audio
      audio.play().catch(e => console.log('Audio play blocked'));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((modes[mode].minutes * 60 - timeLeft) / (modes[mode].minutes * 60)) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Focus Timer</h1>
        <p className="text-slate-500 dark:text-slate-400">Stay concentrated and track your study time.</p>
      </div>

      <Card className="max-w-md mx-auto bg-white/50 dark:bg-charcoal/50 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50">
        <CardContent className="p-8">
          <div className="flex justify-center space-x-2 mb-8 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
            {Object.keys(modes).map((m) => (
              <button
                key={m}
                onClick={() => changeMode(m)}
                className={cn(
                  "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                  mode === m 
                    ? "bg-white dark:bg-charcoal shadow-sm text-slate-900 dark:text-slate-100" 
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                {modes[m].label}
              </button>
            ))}
          </div>

          <div className="relative flex justify-center items-center mb-8">
            <svg className="w-64 h-64 transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-100 dark:text-slate-800"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={120 * 2 * Math.PI}
                strokeDashoffset={120 * 2 * Math.PI * (1 - progress / 100)}
                className={cn("transition-all duration-1000 ease-linear", modes[mode].color)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-5xl font-bold tracking-tighter text-slate-900 dark:text-slate-100 font-mono">
              {formatTime(timeLeft)}
            </div>
          </div>

          {mode === 'focus' && (
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 text-center">
                What are you studying? (Optional)
              </label>
              <input 
                type="text"
                list="focus-subjects-list"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                placeholder="e.g. Physics"
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-violet"
              />
              <datalist id="focus-subjects-list">
                {subjects.map(s => <option key={s.id} value={s.name} />)}
              </datalist>
            </div>
          )}

          <div className="flex justify-center items-center gap-4">
            <button 
              onClick={toggleTimer}
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center text-white transition-transform active:scale-95 shadow-lg",
                isActive ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25" : "bg-accent-violet hover:bg-accent-violet/90 shadow-accent-violet/25"
              )}
            >
              {isActive ? <Pause size={28} className="fill-current" /> : <Play size={28} className="ml-1 fill-current" />}
            </button>
            <button 
              onClick={resetTimer}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
