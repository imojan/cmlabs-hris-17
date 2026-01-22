// src/app/locales/index.js
import id from './id';
import en from './en';

const translations = { id, en };

/**
 * Get translation by key path (e.g., "auth.signIn", "common.save")
 * @param {string} lang - Language code ('id' or 'en')
 * @param {string} key - Dot notation key path
 * @param {object} params - Optional parameters for interpolation
 * @returns {string} Translated string
 */
export function t(lang, key, params = {}) {
  const keys = key.split('.');
  let value = translations[lang] || translations.id;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to Indonesian if key not found
      value = translations.id;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Return key if not found in fallback
        }
      }
      break;
    }
  }
  
  // Handle interpolation (e.g., {min}, {max})
  if (typeof value === 'string' && Object.keys(params).length > 0) {
    return value.replace(/\{(\w+)\}/g, (_, paramKey) => {
      return params[paramKey] !== undefined ? params[paramKey] : `{${paramKey}}`;
    });
  }
  
  return typeof value === 'string' ? value : key;
}

/**
 * Custom hook for translations
 * Use this in components: const { t } = useTranslation();
 */
export { translations };
export default translations;
