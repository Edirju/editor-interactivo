import { atom } from 'nanostores';
import { useStore } from '@nanostores/react';
import es from './es.json';
import en from './en.json';

export type Locale = 'es' | 'en';

const translations: Record<Locale, Record<string, any>> = { es, en };

const getInitialLocale = (): Locale => {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('locale')) {
    return localStorage.getItem('locale') as Locale;
  }
  if (
    typeof navigator !== 'undefined' &&
    navigator.language?.startsWith('en')
  ) {
    return 'en';
  }
  return 'es';
};

export const $locale = atom<Locale>(getInitialLocale());

$locale.listen((locale) => {
  localStorage.setItem('locale', locale);
  document.documentElement.lang = locale;
});

export function setLocale(locale: Locale) {
  $locale.set(locale);
}

function resolveKey(locale: Locale, key: string): string {
  const keys = key.split('.');
  let result: any = translations[locale];
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      return key;
    }
  }
  return typeof result === 'string' ? result : key;
}

export function useTranslation() {
  const locale = useStore($locale);
  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = resolveKey(locale, key);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{{${k}}}`, String(v));
      }
    }
    return text;
  };
  return { t, locale };
}
