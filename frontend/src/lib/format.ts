import type { Language } from '../types/api';

const LOCALES: Record<Language, string> = { bn: 'bn-BD', en: 'en-GB' };

/** Returns an empty string for a value that is not a date. */
export function formatDateTime(value: string, language: Language): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(LOCALES[language], { dateStyle: 'medium', timeStyle: 'short' });
}

export function formatNumber(value: number, language: Language): string {
  return value.toLocaleString(LOCALES[language]);
}
