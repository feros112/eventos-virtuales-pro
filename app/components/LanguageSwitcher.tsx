'use client'

import { useLanguage } from '../context/LanguageContext'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
    const { language, toggleLanguage } = useLanguage()

    return (
        <button
            onClick={toggleLanguage}
            className="fixed top-4 right-4 z-[60] flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 transition-all group"
        >
            <Globe className="w-4 h-4 text-slate-300 group-hover:text-white" />
            <span className="text-xs font-bold font-mono">
                {language === 'es' ? 'ES' : 'EN'}
            </span>
        </button>
    )
}
