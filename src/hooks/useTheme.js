import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useTheme() {
  const [isDark, setIsDark] = useLocalStorage('studymate-theme', true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return { isDark, toggleTheme };
}
