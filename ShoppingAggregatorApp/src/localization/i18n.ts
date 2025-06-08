import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

// Import translation files
import en from './locales/en.json';
import fa from './locales/fa.json';

const STORE_LANGUAGE_KEY = 'settings.lang';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      const storedLanguage = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
      if (storedLanguage) {
        return callback(storedLanguage);
      }
      // Fallback to device language or default
      // For simplicity, we'll use 'en' as a fallback here.
      // You could use `findBestAvailableLanguage` from `react-native-localize` for device language.
      return callback('en');
    } catch (error) {
      console.error('Error detecting language from AsyncStorage:', error);
      return callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem(STORE_LANGUAGE_KEY, language);
    } catch (error) {
      console.error('Error caching user language:', error);
    }
  },
};

i18n
  .use(languageDetector as any) // Cast to any due to type mismatch with i18next's LanguageDetectorModule
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3', // For react-native, to ensure JSON v3 compatibility
    resources: {
      en: {
        translation: en,
      },
      fa: {
        translation: fa,
      },
    },
    // lng: 'en', // Default language, languageDetector will override this
    fallbackLng: 'en', // Fallback language if detection fails or selected lang has no key
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    react: {
      useSuspense: false, // Set to false if you don't want to use Suspense
    },
  });

// Handle RTL for Persian
i18n.on('languageChanged', (lng) => {
  if (lng === 'fa') {
    I18nManager.forceRTL(true);
  } else {
    I18nManager.forceRTL(false);
  }
  // Persist the new language choice
  AsyncStorage.setItem(STORE_LANGUAGE_KEY, lng);

  // NOTE: For RTL changes to take full effect, a reload of the app might be necessary.
  // This can be handled by prompting the user or using RNRestart.
  // For this subtask, we'll focus on text switching.
  // If I18nManager.isRTL !== (lng === 'fa')) { // Check if a reload is needed
  //    RNRestart.Restart(); // Requires installing react-native-restart
  // }
});


export default i18n;
