// src/app/hooks/useTheme.js
// Hook untuk mengelola tema (light/dark mode)
import { create } from "zustand";
import { useEffect } from "react";

const THEME_STORAGE_KEY = "hris_theme";

// Get initial theme from localStorage or system preference
const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark" || stored === "light") {
    return stored;
  }
  
  // Check system preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  
  return "light";
};

// Zustand store for theme
export const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  
  setTheme: (newTheme) => {
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    set({ theme: newTheme });
  },
  
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      return { theme: newTheme };
    });
  },
}));

// Hook yang apply theme ke document
export function useTheme() {
  const { theme, setTheme, toggleTheme } = useThemeStore();
  
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
  }, [theme]);
  
  return { theme, setTheme, toggleTheme, isDark: theme === "dark" };
}

export default useTheme;
