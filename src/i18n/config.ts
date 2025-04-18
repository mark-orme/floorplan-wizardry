import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import locale resources
import enTranslation from './locales/en/translation.json';
import arTranslation from './locales/ar/translation.json';
import esTranslation from './locales/es/translation.json';

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
  }
};

// Define RTL languages for our helper function
const rtlLanguages = ['ar', 'he', 'fa', 'ur'];

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
    
    // Define supported languages
    supportedLngs: ['en', 'ar', 'es'],
    
    // Custom data for measurement systems by locale
    // Can be accessed via i18n.getDataByLanguage(i18n.language)?.customData?.measurement
    ns: ['translation'],
    defaultNS: 'translation',
    
    // Store custom data about measurement systems
    // These must be passed as part of i18n options
    backend: {
      // This is just a placeholder for other backend options if needed
    },
    
    // Store additional custom information
    returnObjects: true,
    
    // Other standard options
    react: {
      useSuspense: false,
    }
  });

// Add custom data to language resources
i18n.addResourceBundle('en', 'translation', {}, true, true);
i18n.addResourceBundle('ar', 'translation', {}, true, true);
i18n.addResourceBundle('es', 'translation', {}, true, true);

// Set custom data for measurement systems
i18n.services.resourceStore.data.en.customData = { measurement: 'imperial' };
i18n.services.resourceStore.data.ar.customData = { measurement: 'metric' };
i18n.services.resourceStore.data.es.customData = { measurement: 'metric' };

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
  return rtlLanguages.includes(i18n.language);
};
