// src/app/hooks/useTranslation.js
import { useCallback } from 'react';
import { useLanguage } from '@/app/store/languageStore';
import { t as translate } from '@/app/locales';

/**
 * Custom hook untuk menggunakan sistem terjemahan
 * @returns {{ t: function, language: string, setLanguage: function }}
 */
export function useTranslation() {
  const { language, setLanguage } = useLanguage();
  
  /**
   * Translate key to current language
   * @param {string} key - Dot notation key (e.g., "auth.signIn")
   * @param {object} params - Optional interpolation params
   * @returns {string} Translated text
   */
  const t = useCallback((key, params = {}) => {
    return translate(language, key, params);
  }, [language]);
  
  return { t, language, setLanguage };
}

export default useTranslation;
