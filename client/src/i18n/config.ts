import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';

// Try to get language from localStorage
const getStoredLanguage = () => {
  try {
    const stored = localStorage.getItem('settings-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      const language = parsed.state?.language || 'French';
      console.log('i18n: Loading language from localStorage:', language, 'Full parsed:', parsed);
      
      // Validate that the language exists in our resources
      const validLanguages = ['English', 'French', 'Spanish'];
      if (validLanguages.includes(language)) {
        return language;
      } else {
        console.warn('i18n: Invalid language in storage:', language, 'Defaulting to French');
        return 'French';
      }
    }
    console.log('i18n: No settings in localStorage, using default: French');
  } catch (error) {
    console.error('Error reading language from localStorage:', error);
  }
  return 'French';
};

// Initialize i18n with debug mode enabled
i18n
  .use(initReactI18next)
  .init({
    resources: {
      English: { translation: en },
      French: { translation: fr },
      Spanish: { translation: es },
    },
    lng: getStoredLanguage(),
    fallbackLng: 'French',
    interpolation: {
      escapeValue: false,
    },
    debug: process.env.NODE_ENV === 'development',
    saveMissing: true, // Log missing translations
    missingKeyHandler: (lng, ns, key) => {
      console.warn(`Missing translation: ${key} for language ${lng}`);
    },
  });

// Log current language on initialization
console.log('i18n: Initialized with language:', i18n.language);
console.log('i18n: Available languages:', i18n.languages);

export default i18n;
