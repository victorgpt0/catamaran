'use client'
import { useLang } from '@/components/lang-context'

export default function LangToggle() {
  const { lang, setLang } = useLang()
  
  return (
    <button 
      onClick={() => setLang(lang === 'en' ? 'no' : 'en')}
      className="fixed top-6 right-6 z-50 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-white hover:bg-white hover:text-black transition"
    >
      {lang === 'en' ? 'NO 🇳🇴' : 'EN 🇬🇧'}
    </button>
  )
}