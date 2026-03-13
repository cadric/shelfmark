import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import da from './locales/da.json';
import {
  DEFAULT_LANGUAGE,
  applyDocumentLanguage,
  resolveInitialLanguage,
} from './utils/languageConfig';

const resources = {
  en: { translation: en },
  da: { translation: da },
} as const;

const initialLanguage = resolveInitialLanguage();

export const i18nReady = i18n.isInitialized
  ? Promise.resolve(i18n)
  : i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: initialLanguage,
        fallbackLng: DEFAULT_LANGUAGE,
        interpolation: {
          escapeValue: false,
        },
      })
      .then(() => {
        applyDocumentLanguage(i18n.resolvedLanguage || initialLanguage);
        return i18n;
      });

applyDocumentLanguage(i18n.resolvedLanguage || initialLanguage);

export default i18n;
