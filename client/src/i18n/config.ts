import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      English: { translation: en },
      French: { translation: fr },
      Spanish: { translation: es },
    },
    lng: 'English',
    fallbackLng: 'English',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
