import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

const initialSubjects = [];

const initialTasks = [];

export function AppProvider({ children }) {
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('studymate-subjects');
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('studymate-tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [studySessions, setStudySessions] = useState(() => {
    const saved = localStorage.getItem('studymate-sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [timetable, setTimetable] = useState(() => {
    const saved = localStorage.getItem('studymate-timetable');
    // Default empty timetable
    return saved ? JSON.parse(saved) : { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] };
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('studymate-settings');
    return saved ? JSON.parse(saved) : {
      studentName: '',
      isFirstLaunch: true,
      dailyGoalMinutes: 120,
      availableDays: [1, 2, 3, 4, 5],
      preferredStartTime: '18:00',
      preferredEndTime: '22:00'
    };
  });

  useEffect(() => {
    localStorage.setItem('studymate-subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('studymate-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('studymate-sessions', JSON.stringify(studySessions));
  }, [studySessions]);

  useEffect(() => {
    localStorage.setItem('studymate-timetable', JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem('studymate-settings', JSON.stringify(settings));
  }, [settings]);

  // Tasks actions
  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: uuidv4(), completed: false }]);
  };
  const updateTask = (id, updates) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };
  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };
  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Subjects actions
  const addSubject = (subject) => {
    setSubjects([...subjects, { ...subject, id: subject.id || uuidv4() }]);
  };
  const updateSubject = (id, updates) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, ...updates } : s));
  };
  const deleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  // Study Session actions
  const addStudySession = (session) => {
    setStudySessions([...studySessions, { ...session, id: uuidv4(), date: new Date().toISOString() }]);
  };

  // Timetable actions
  const addTimetableSlot = (day, slot) => {
    setTimetable({
      ...timetable,
      [day]: [...(timetable[day] || []), { ...slot, id: uuidv4() }].sort((a, b) => a.startTime.localeCompare(b.startTime))
    });
  };
  const deleteTimetableSlot = (day, slotId) => {
    setTimetable({
      ...timetable,
      [day]: (timetable[day] || []).filter(s => s.id !== slotId)
    });
  };

  const updateSettings = (updates) => {
    setSettings({ ...settings, ...updates });
  };

  return (
    <AppContext.Provider value={{
      subjects, addSubject, updateSubject, deleteSubject,
      tasks, addTask, updateTask, deleteTask, toggleTask,
      studySessions, addStudySession,
      timetable, addTimetableSlot, deleteTimetableSlot,
      settings, updateSettings
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
