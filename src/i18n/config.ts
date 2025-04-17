
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import locale resources
import enTranslation from './locales/en/translation.json';
import arTranslation from './locales/ar/translation.json';

// Resources configuration
const resources = {
  en: {
    translation: enTranslation
  },
  ar: {
    translation: arTranslation
  }
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    
    // RTL support
    supportedLngs: ['en', 'ar'],
    // Define RTL languages
    rtl: ['ar'],
    
    // Measurement system by locale
    // Can be accessed in the app via i18n.getDataByLanguage(i18n.language).measurement
    customData: {
      en: {
        measurement: 'imperial'
      },
      ar: {
        measurement: 'metric'
      }
    }
  });

// Export configured i18n instance
export default i18n;

// Helper function to get the current measurement system
export const getMeasurementSystem = (): 'metric' | 'imperial' => {
  const lang = i18n.language || 'en';
  const data = i18n.getDataByLanguage(lang);
  return (data?.customData?.measurement as 'metric' | 'imperial') || 'metric';
};

// Helper for RTL detection
export const isRTL = (): boolean => {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(i18n.language);
};
