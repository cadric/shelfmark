export const LANGUAGE_PREFERENCE_KEY = 'preferred-language';
export const DEFAULT_LANGUAGE = 'en';
export const SUPPORTED_LANGUAGES = ['en', 'da'] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

export function normalizeLanguage(value?: string | null): SupportedLanguage {
  if (!value) {
    return DEFAULT_LANGUAGE;
  }

  const normalized = value.toLowerCase().split(/[-_]/)[0];
  return isSupportedLanguage(normalized) ? normalized : DEFAULT_LANGUAGE;
}

export function resolveInitialLanguage(): SupportedLanguage {
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(LANGUAGE_PREFERENCE_KEY);
      if (stored) {
        return normalizeLanguage(stored);
      }
    }
  } catch {
    // localStorage may be unavailable in private browsing or tests
  }

  if (typeof navigator !== 'undefined' && navigator.language) {
    return normalizeLanguage(navigator.language);
  }

  return DEFAULT_LANGUAGE;
}

export function applyDocumentLanguage(language: string): void {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = language;
  }
}
