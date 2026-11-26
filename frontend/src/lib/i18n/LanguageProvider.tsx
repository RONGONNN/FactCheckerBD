'use client';

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from 'react';
import type { Language } from '../../types/api';
import { createBrowserStore } from '../storage/browserStore';
import { messages, type Messages } from './messages';

const languageStore = createBrowserStore('factcheck.language');

interface LanguageContextValue {
  language: Language;
  t: Messages;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language: Language = useSyncExternalStore(
    languageStore.subscribe,
    () => (languageStore.read() === 'en' ? 'en' : 'bn'),
    () => 'bn',
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => languageStore.write(language === 'bn' ? 'en' : 'bn');

  return (
    <LanguageContext value={{ language, t: messages[language], toggleLanguage }}>
      {children}
    </LanguageContext>
  );
}

export function useLanguage(): LanguageContextValue {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage must be used inside LanguageProvider');
  return value;
}
