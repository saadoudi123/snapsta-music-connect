
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import enTranslation from './locales/en/translation.json';
import arTranslation from './locales/ar/translation.json';
import ruTranslation from './locales/ru/translation.json';

// Resources contain all the translation files
const resources = {
  en: {
    translation: enTranslation
  },
  ar: {
    translation: arTranslation
  },
  ru: {
    translation: ruTranslation
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar', 'ru'],
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    react: {
      useSuspense: true,
    },
  });

// Function to change language direction for RTL languages
export const changeLanguageDirection = (language: string) => {
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = language;
};

// Initialize direction based on current language
changeLanguageDirection(i18n.language);

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  changeLanguageDirection(lng);
});

export default i18n;
