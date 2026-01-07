'use client'

import { useLanguage } from '../context/LanguageContext'
import { Globe } from 'lucide-react'

export default function FloatingLanguage() {
    const { language, toggleLanguage } = useLanguage()

    return (
        <button
            onClick={toggleLanguage}
            className="fixed bottom-5 left-5 z-[9999] flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all group scale-100 active:scale-95"
            style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999 }}
        >
            <Globe className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 animate-pulse" />
            <span className="text-xs font-black font-mono tracking-widest">
                {language === 'es' ? 'ES' : 'EN'}
            </span>
        </button>
    )
}
