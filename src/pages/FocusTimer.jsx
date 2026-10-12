import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent } from '../components/ui/Card';
import { Play, Coffee, Brain, ShieldCheck, Square, LogOut } from 'lucide-react';
import { cn } from '../utils/cn';
import { v4 as uuidv4 } from 'uuid';

export default function FocusTimer() {
  const { subjects, addStudySession, addSubject } = useAppContext();

  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [sessionSaved, setSessionSaved] = useState(false);
  const startedAtRef = useRef(null);
  const savedRef = useRef(false);

  const modes = {
    focus: { label: 'Focus', minutes: 25, icon: Brain, color: 'text-accent-violet' },
    shortBreak: { label: 'Short Break', minutes: 5, icon: Coffee, color: 'text-emerald-500' },
    longBreak: { label: 'Long Break', minutes: 15, icon: Coffee, color: 'text-blue-500' }
  };

  const saveFocusSession = () => {
    if (savedRef.current || mode !== 'focus' || startedAtRef.current === null) return;
    savedRef.current = true;
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000));
    const duration = Math.min(modes.focus.minutes, Math.floor(elapsedSeconds / 60));
    if (duration < 1) return;

    let finalSubjectId = null;
    const normalizedSubject = selectedSubject.trim();
    if (normalizedSubject) {
      const existing = subjects.find(s => s.name.toLowerCase() === normalizedSubject.toLowerCase());
      if (existing) {
        finalSubjectId = existing.id;
      } else {
        finalSubjectId = uuidv4();
        const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e', '#64748b'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        addSubject({ id: finalSubjectId, name: normalizedSubject, color });
      }
    }

    addStudySession({ duration, subjectId: finalSubjectId, type: 'focus' });
    setSessionSaved(true);
  };

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return undefined;
    const interval = setInterval(() => {
      setTimeLeft(previous => Math.max(0, previous - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && isLocked) {
      setIsActive(false);
      setIsStopped(true);
      saveFocusSession();
    }
  }, [timeLeft, isLocked]);

  // Keep the browser Back button from leaving the active focus session.
  useEffect(() => {
    if (!isLocked) return undefined;
    const lockHistory = () => window.history.pushState({ studyMateFocusLock: true }, '', window.location.href);
    window.history.pushState({ studyMateFocusLock: true }, '', window.location.href);
    window.addEventListener('popstate', lockHistory);
    return () => window.removeEventListener('popstate', lockHistory);
  }, [isLocked]);

  const startTimer = () => {
    if (isStopped) return;
    if (!isLocked) {
      setIsLocked(true);
      setSessionSaved(false);
      savedRef.current = false;
      startedAtRef.current = Date.now();
    }
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
    setIsStopped(true);
    saveFocusSession();
  };

  const quitSession = () => {
    if (!sessionSaved && !savedRef.current) saveFocusSession();
    setIsActive(false);
    setIsLocked(false);
    setIsStopped(false);
    setTimeLeft(modes[mode].minutes * 60);
    startedAtRef.current = null;
    savedRef.current = false;
    setSessionSaved(false);
    setSelectedSubject('');
  };

  const changeMode = (newMode) => {
    if (isLocked) return;
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(modes[newMode].minutes * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((modes[mode].minutes * 60 - timeLeft) / (modes[mode].minutes * 60)) * 100;
  const TimerIcon = modes[mode].icon;

  const timerFace = (
    <Card className={cn(
      "w-full max-w-md mx-auto border-slate-200/50 bg-white/70 shadow-2xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-[#111426]/90",
      isLocked && "border-white/10 bg-white/5 dark:border-white/10 dark:bg-white/5"
    )}>
      <CardContent className="p-6 sm:p-8">
        {!isLocked && (
          <div className="mb-8 flex justify-center space-x-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/50">
            {Object.keys(modes).map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => changeMode(m)}
                className={cn(
                  "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  mode === m ? "bg-white text-slate-900 shadow-sm dark:bg-charcoal dark:text-slate-100" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                {modes[m].label}
              </button>
            ))}
          </div>
        )}

        <div className="mb-7 flex flex-col items-center">
          <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-500/15", modes[mode].color)}>
            <TimerIcon size={25} />
          </div>
          <div className="relative flex items-center justify-center">
            <svg className="h-56 w-56 -rotate-90 sm:h-64 sm:w-64" viewBox="0 0 256 256" aria-hidden="true">
              <circle cx="128" cy="128" r="116" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
              <circle cx="128" cy="128" r="116" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={116 * 2 * Math.PI} strokeDashoffset={116 * 2 * Math.PI * (1 - progress / 100)} className={cn("transition-all duration-1000 ease-linear", modes[mode].color)} strokeLinecap="round" />
            </svg>
            <div className="absolute font-mono text-5xl font-bold tracking-tighter text-slate-900 dark:text-white sm:text-6xl" aria-live="polite">
              {formatTime(timeLeft)}
            </div>
          </div>
          {isLocked && (
            <p className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
              {timeLeft === 0 ? 'Focus session complete.' : isStopped ? 'Timer stopped. Quit when you are ready.' : 'Focus mode is locked. Stay with your study session.'}
            </p>
          )}
        </div>

        {!isLocked && mode === 'focus' && (
          <div className="mb-7">
            <label className="mb-2 block text-center text-sm font-medium text-slate-700 dark:text-slate-300">What are you studying? (Optional)</label>
            <input
              type="text"
              list="focus-subjects-list"
              value={selectedSubject}
              onChange={event => setSelectedSubject(event.target.value)}
              placeholder="e.g. Physics"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent-violet dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100"
            />
            <datalist id="focus-subjects-list">
              {subjects.map(subject => <option key={subject.id} value={subject.name} />)}
            </datalist>
          </div>
        )}

        {!isLocked ? (
          <button type="button" onClick={startTimer} className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-violet px-5 py-4 font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110 active:scale-[0.99]">
            <Play size={19} fill="currentColor" /> Start Focus Session
          </button>
        ) : !isStopped ? (
          <button type="button" onClick={stopTimer} className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-4 font-semibold text-white shadow-lg transition hover:bg-amber-600 active:scale-[0.99]">
            <Square size={17} fill="currentColor" /> Stop
          </button>
        ) : (
          <div className="space-y-3">
            {sessionSaved && <p className="text-center text-sm text-emerald-500">Study time saved to your progress.</p>}
            <button type="button" onClick={quitSession} className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-4 font-semibold text-white shadow-lg transition hover:bg-rose-700 active:scale-[0.99]">
              <LogOut size={18} /> Quit Session
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLocked) {
    return (
      <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-y-auto bg-[#080916] px-4 py-8 text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-[140px]" />
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(#a78bfa 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        </div>
        <div className="relative z-10 w-full max-w-xl">
          <div className="mb-7 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">
              <ShieldCheck size={15} /> StudyMate Focus Lock
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">One task. One session.</h1>
            <p className="mt-2 text-sm text-slate-400">Navigation is hidden until you stop and quit your session.</p>
          </div>
          {timerFace}
          <p className="mt-5 text-center text-xs text-slate-500">Keep this tab open. Your session is recorded when you stop or finish.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Focus Timer</h1>
        <p className="text-slate-500 dark:text-slate-400">Start a session to hide navigation and enter distraction-free focus mode.</p>
      </div>
      {timerFace}
    </div>
  );
}
