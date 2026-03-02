'use client'

import { createContext, useContext, useState } from 'react'
import { dictionary, Language } from '@/lib/dictionary'

interface LangContextType {
  lang: Language
  t: typeof dictionary.en // Type based on English structure
  setLang: (lang: Language) => void
}

const LangContext = createContext<LangContextType | undefined>(undefined)

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en')

  return (
    <LangContext.Provider value={{ lang, setLang, t: dictionary[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const context = useContext(LangContext)
  if (!context) throw new Error('useLang must be used within LangProvider')
  return context
}