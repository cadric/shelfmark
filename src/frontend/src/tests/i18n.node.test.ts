import * as assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, it } from 'node:test';
import {
  applyDocumentLanguage,
  normalizeLanguage,
  resolveInitialLanguage,
} from '../utils/languageConfig.js';

const originalNavigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
const originalDocumentDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'document');
const originalLocalStorageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
const sourceRoot = new URL('../../../src/frontend/src/locales/', import.meta.url);

const readLocale = (fileName: string): Record<string, string> =>
  JSON.parse(readFileSync(new URL(fileName, sourceRoot), 'utf8'));

const setGlobal = <T>(key: 'navigator' | 'document' | 'localStorage', value: T): void => {
  Object.defineProperty(globalThis, key, {
    value,
    configurable: true,
    writable: true,
  });
};

const restoreGlobal = (
  key: 'navigator' | 'document' | 'localStorage',
  descriptor: PropertyDescriptor | undefined,
): void => {
  if (descriptor) {
    Object.defineProperty(globalThis, key, descriptor);
    return;
  }

  Reflect.deleteProperty(globalThis, key);
};

describe('i18n', () => {
  beforeEach(() => {
    // Intentionally empty: keeps fixture shape aligned with other node tests.
  });

  afterEach(() => {
    restoreGlobal('navigator', originalNavigatorDescriptor);
    restoreGlobal('document', originalDocumentDescriptor);
    restoreGlobal('localStorage', originalLocalStorageDescriptor);
  });

  it('normalizes supported languages and falls back to english', () => {
    assert.equal(normalizeLanguage('da-DK'), 'da');
    assert.equal(normalizeLanguage('fr-FR'), 'en');
    assert.equal(normalizeLanguage(undefined), 'en');
  });

  it('resolves the initial language from local storage before navigator', () => {
    const storage = {
      getItem: (key: string) => (key === 'preferred-language' ? 'da' : null),
      setItem: () => undefined,
      removeItem: () => undefined,
      clear: () => undefined,
      key: () => null,
      length: 0,
    } as Storage;

    setGlobal('localStorage', storage);
    setGlobal('navigator', {
      language: 'en-US',
    } as Navigator);

    assert.equal(resolveInitialLanguage(), 'da');
  });

  it('falls back to navigator language when no stored preference exists', () => {
    const storage = {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
      clear: () => undefined,
      key: () => null,
      length: 0,
    } as Storage;

    setGlobal('localStorage', storage);
    setGlobal('navigator', {
      language: 'da-DK',
    } as Navigator);

    assert.equal(resolveInitialLanguage(), 'da');
  });

  it('provides matching core translation keys for english and danish', () => {
    const en = readLocale('en.json');
    const da = readLocale('da.json');

    assert.equal(en['common.language'], 'Language');
    assert.equal(da['common.language'], 'Sprog');
    assert.equal(en['common.saveChanges'], 'Save Changes');
    assert.equal(da['common.saveChanges'], 'Gem ændringer');
  });

  it('updates the html lang attribute when available', () => {
    const documentElement = { lang: '' };
    setGlobal('document', {
      documentElement,
    } as Document);

    applyDocumentLanguage('da');
    assert.equal(documentElement.lang, 'da');
  });
});
