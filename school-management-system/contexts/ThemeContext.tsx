import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ThemeOption, FontSizeOption, LanguageOption, ThemeState } from '../types';

interface ThemeContextType extends ThemeState {
  setThemeOption: (theme: ThemeOption) => void;
  setFontSizeOption: (size: FontSizeOption) => void;
  setLanguageOption: (lang: LanguageOption) => void;
}

const defaultThemeState: ThemeState = {
  selectedTheme: 'light',
  fontSize: 'md',
  language: 'en',
};

export const ThemeContext = createContext<ThemeContextType>({
  ...defaultThemeState,
  setThemeOption: () => {},
  setFontSizeOption: () => {},
  setLanguageOption: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [selectedTheme, setSelectedThemeState] = useState<ThemeOption>(() => {
    const storedTheme = localStorage.getItem('appTheme_selectedTheme') as ThemeOption | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return storedTheme && ['light', 'dark', 'high-contrast'].includes(storedTheme) 
           ? storedTheme 
           : prefersDark ? 'dark' : 'light';
  });

  const [fontSize, setFontSizeState] = useState<FontSizeOption>(() => {
    return (localStorage.getItem('appTheme_fontSize') as FontSizeOption | null) || 'md';
  });

  const [language, setLanguageState] = useState<LanguageOption>(() => {
    return (localStorage.getItem('appTheme_language') as LanguageOption | null) || 'en';
  });

  const setThemeOption = useCallback((newTheme: ThemeOption) => {
    setSelectedThemeState(newTheme);
    localStorage.setItem('appTheme_selectedTheme', newTheme);
  }, []);

  const setFontSizeOption = useCallback((newSize: FontSizeOption) => {
    setFontSizeState(newSize);
    localStorage.setItem('appTheme_fontSize', newSize);
  }, []);

  const setLanguageOption = useCallback((newLang: LanguageOption) => {
    setLanguageState(newLang);
    localStorage.setItem('appTheme_language', newLang);
    // Here you would integrate with an i18n library if implementing full translation
    console.log(`Language changed to: ${newLang} (mock implementation)`);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'theme-hc'); 
    
    if (selectedTheme === 'dark') {
      root.classList.add('dark');
    } else if (selectedTheme === 'high-contrast') {
      root.classList.add('theme-hc'); 
    } else {
      root.classList.add('light'); 
    }
  }, [selectedTheme]);

  // This effect is now handled in App.tsx to avoid direct DOM manipulation from context if possible
  // useEffect(() => {
  //   const root = window.document.documentElement;
  //   root.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg');
  //   root.classList.add(`text-size-${fontSize}`);
  // }, [fontSize]);

  return (
    <ThemeContext.Provider value={{ selectedTheme, fontSize, language, setThemeOption, setFontSizeOption, setLanguageOption }}>
      {children}
    </ThemeContext.Provider>
  );
};