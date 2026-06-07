import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';

// System is configured to use French only
// Language selector has been removed from Settings
const getStoredLanguage = () => {
  return 'French'; // Always return French as the system language
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
    debug: false,
    saveMissing: true, // Log missing translations
    missingKeyHandler: (lng, ns, key) => {
      console.warn(`Missing translation: ${key} for language ${lng}`);
    },
  });

// Log current language on initialization
console.log('i18n: Initialized with language:', i18n.language);
console.log('i18n: Available languages:', i18n.languages);

export default i18n;
