'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Lang = 'tr' | 'en';
const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'tr', setLang: () => {}
});

export const useLang = () => useContext(LangContext);

export const t = (tr: string, en: string, lang: Lang) => lang === 'tr' ? tr : en;

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('tr');

  useEffect(() => {
    const browserLang = navigator.language.startsWith('en') ? 'en' : 'tr';
    setLang(browserLang);
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}
