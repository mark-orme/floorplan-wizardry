
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import locale resources
import enTranslation from './locales/en/translation.json';
import arTranslation from './locales/ar/translation.json';
import esTranslation from './locales/es/translation.json';
import frTranslation from './locales/fr/translation.json';
import jaTranslation from './locales/ja/translation.json';

// Resources configuration
const resources = {
  en: {
    translation: enTranslation
  },
  ar: {
    translation: arTranslation
  },
  es: {
    translation: esTranslation
  },
  fr: {
    translation: frTranslation
  },
  ja: {
    translation: jaTranslation
  }
};

// Define RTL languages
const rtlLanguages = ['ar', 'he', 'fa', 'ur'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false,
    },
    
    supportedLngs: ['en', 'ar', 'es', 'fr', 'ja'],
    
    ns: ['translation'],
    defaultNS: 'translation',
    
    react: {
      useSuspense: false,
    }
  });

// Add custom data to language resources
Object.keys(resources).forEach(lang => {
  i18n.addResourceBundle(lang, 'translation', {}, true, true);
  
  // Set measurement system based on locale
  i18n.services.resourceStore.data[lang].customData = {
    measurement: ['us', 'gb'].includes(lang) ? 'imperial' : 'metric'
  };
});

export default i18n;

// Helper function to get the current measurement system
export const getMeasurementSystem = (): 'metric' | 'imperial' => {
  const lang = i18n.language || 'en';
  const data = i18n.getDataByLanguage(lang);
  return (data?.customData?.measurement as 'metric' | 'imperial') || 'metric';
};

// Helper for RTL detection
export const isRTL = (): boolean => {
  return rtlLanguages.includes(i18n.language);
};
