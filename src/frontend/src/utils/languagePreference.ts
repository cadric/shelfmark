import i18n from '../i18n';
import {
  LANGUAGE_PREFERENCE_KEY,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  applyDocumentLanguage,
  normalizeLanguage,
  resolveInitialLanguage,
} from './languageConfig';
import { SelectFieldConfig } from '../types/settings';

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'English',
  da: 'Dansk',
};

export const LANGUAGE_FIELD: SelectFieldConfig = {
  type: 'SelectField',
  key: '_LANGUAGE',
  label: 'Language',
  description: 'Choose your preferred interface language.',
  value: DEFAULT_LANGUAGE,
  options: SUPPORTED_LANGUAGES.map((language) => ({
    value: language,
    label: LANGUAGE_LABELS[language],
  })),
};

export function getStoredLanguagePreference(): SupportedLanguage {
  try {
    const stored = localStorage.getItem(LANGUAGE_PREFERENCE_KEY);
    if (stored) {
      return normalizeLanguage(stored);
    }
  } catch {
    // localStorage may be unavailable in private browsing
  }

  return resolveInitialLanguage();
}

export async function setLanguagePreference(language: string): Promise<void> {
  const normalized = normalizeLanguage(language);

  try {
    localStorage.setItem(LANGUAGE_PREFERENCE_KEY, normalized);
  } catch {
    // localStorage may be unavailable in private browsing
  }

  await i18n.changeLanguage(normalized);
  applyDocumentLanguage(i18n.resolvedLanguage || normalized);
}
