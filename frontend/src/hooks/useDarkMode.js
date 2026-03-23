import { useState, useEffect } from 'react';

const STORAGE_KEY = 'star-stalker-theme';

/**
 * Persists dark/light preference in localStorage.
 * Applies `data-theme="dark"` to <body> so CSS vars cascade app-wide.
 * Returns [isDark, toggleDark].
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch { /* storage blocked */ }
  }, [isDark]);

  const toggleDark = () => setIsDark(prev => !prev);

  return [isDark, toggleDark];
}
