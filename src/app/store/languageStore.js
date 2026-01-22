// src/app/store/languageStore.js
import { create } from "zustand";

const LANGUAGE_KEY = "hris_language";

// Get stored language or default to Indonesian
const getStoredLanguage = () => {
  try {
    return localStorage.getItem(LANGUAGE_KEY) || "id";
  } catch {
    return "id";
  }
};

export const useLanguage = create((set) => ({
  language: getStoredLanguage(),
  
  setLanguage: (lang) => {
    localStorage.setItem(LANGUAGE_KEY, lang);
    set({ language: lang });
  },
}));
