# Contributing Translations

Shelfmark's frontend translations live in `src/frontend/src/locales/`.

## Current structure

- One flat JSON file per language, for example `en.json` and `da.json`
- Keys use dot notation, for example `header.settings` or `details.viewSeries`
- Frontend-only strings are translated in the frontend; backend-generated settings labels still remain English for now

## Adding a new language

1. Copy `src/frontend/src/locales/en.json` to a new file such as `fr.json`
2. Translate the values and keep the keys unchanged
3. Add the locale code to `SUPPORTED_LANGUAGES` in `src/frontend/src/utils/languageConfig.ts`
4. Register the locale in `src/frontend/src/i18n.ts`
5. Add the language label to `LANGUAGE_LABELS` in `src/frontend/src/utils/languagePreference.ts`

## Guidelines

- Keep the key names stable; translate only the values
- Prefer short, UI-friendly phrasing over literal word-for-word translation
- Keep technical names such as `Docker Compose`, `OIDC`, and filenames unchanged unless the UI already translates them
- If a string includes interpolation such as `{{target}}`, keep the placeholder exactly as written

## Validation

Run the frontend checks before opening a PR:

```bash
make typecheck
make build
make frontend-test
```
