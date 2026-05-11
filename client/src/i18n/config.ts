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
      const language = parsed.state?.language || 'English';
      console.log('i18n: Loading language from localStorage:', language);
      return language;
    }
    console.log('i18n: No settings in localStorage, using default: English');
  } catch (error) {
    console.error('Error reading language from localStorage:', error);
  }
  return 'English';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      English: { translation: en },
      French: { translation: fr },
      Spanish: { translation: es },
    },
    lng: getStoredLanguage(),
    fallbackLng: 'English',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
