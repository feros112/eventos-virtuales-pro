'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, TranslationType } from '../utils/translations'

type Language = 'es' | 'en'

interface LanguageContextType {
    language: Language
    t: TranslationType['es'] // Type inference based on Spanish structure
    toggleLanguage: () => void
    setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    // Default to 'es' 
    const [language, setLanguageState] = useState<Language>('es')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language
        if (savedLang) {
            setLanguageState(savedLang)
        }
        setMounted(true)
    }, [])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem('language', lang)
    }

    const toggleLanguage = () => {
        setLanguage(language === 'es' ? 'en' : 'es')
    }

    const t = translations[language]

    // Render children immediately to avoid blocking UI, 
    // even if language might flip from default 'es' to 'en' after mount.
    // This is better than returning null.

    return (
        <LanguageContext.Provider value={{ language, t, toggleLanguage, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
