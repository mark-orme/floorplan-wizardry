
import { useState, useEffect } from 'react';

type ThemeType = 'light' | 'dark' | 'system';

interface UseThemeReturn {
  theme: ThemeType;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeType) => void;
}

export const useTheme = (): UseThemeReturn => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    // Check for saved theme in localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as ThemeType | null;
      return savedTheme || 'system';
    }
    return 'system';
  });
  
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  
  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);
  
  // Update resolvedTheme when theme changes
  useEffect(() => {
    if (theme === 'dark') {
      setResolvedTheme('dark');
    } else if (theme === 'light') {
      setResolvedTheme('light');
    } else {
      // System theme - check preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Update document class
    if (resolvedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, resolvedTheme]);
  
  const handleSetTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
  };
  
  return {
    theme,
    resolvedTheme,
    setTheme: handleSetTheme
  };
};
