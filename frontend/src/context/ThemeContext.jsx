import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePersistentState } from '../hooks/usePersistentState.js';

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
  prefersReducedMotion: false,
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = usePersistentState('simplecalc_theme', undefined);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const darkMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

    setPrefersReducedMotion(motionMedia.matches);

    if (theme === undefined) {
      setTheme(darkMedia.matches ? 'dark' : 'light');
    }

    const onDarkChange = (event) => {
      if (theme === undefined && event.matches) {
        setTheme('dark');
      }
    };

    const onMotionChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    darkMedia.addEventListener('change', onDarkChange);
    motionMedia.addEventListener('change', onMotionChange);

    return () => {
      darkMedia.removeEventListener('change', onDarkChange);
      motionMedia.removeEventListener('change', onMotionChange);
    };
  }, [theme, setTheme]);

  useEffect(() => {
    if (theme) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.documentElement.classList.toggle('light', theme === 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme: theme || 'dark', toggleTheme, prefersReducedMotion }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
