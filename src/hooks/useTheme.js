import { useCallback, useEffect, useState } from 'react';

const THEME_KEY = 'studymate-theme';
const readTheme = () => {
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    return saved === null ? true : JSON.parse(saved);
  } catch {
    return true;
  }
};

const applyTheme = (isDark) => {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', Boolean(isDark));
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

export function useTheme() {
  const [isDark, setIsDark] = useState(readTheme);

  useEffect(() => {
    applyTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    const syncTheme = (event) => {
      const nextTheme = typeof event?.detail === 'boolean' ? event.detail : readTheme();
      setIsDark(nextTheme);
      applyTheme(nextTheme);
    };
    const onStorage = (event) => {
      if (event.key === THEME_KEY) syncTheme();
    };
    window.addEventListener('studymate-theme-change', syncTheme);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('studymate-theme-change', syncTheme);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme = !readTheme();
    try {
      window.localStorage.setItem(THEME_KEY, JSON.stringify(nextTheme));
    } catch {
      // Keep the theme switch functional for this page even if storage is blocked.
    }
    setIsDark(nextTheme);
    applyTheme(nextTheme);
    window.dispatchEvent(new CustomEvent('studymate-theme-change', { detail: nextTheme }));
  }, []);

  return { isDark, toggleTheme };
}
