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
    // Default to 'es' but try to read from localStorage
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

    // Prevent hydration mismatch by defining t based on initial state, 
    // but actual switching happens after mount or efficiently
    const t = translations[language]

    if (!mounted) {
        return <>{children}</> // Render children without context initially to avoid mismatch or handle differently
        // Actually, for context providers, it's often better to render with default to avoid flickering
        // simpler approach: just render.
    }

    return (
        <LanguageContext.Provider value={{ language, t, toggleLanguage, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        // Fallback if used outside provider (e.g. initial render of some components)
        // returns default Spanish to avoid crashing, but warns
        console.warn('useLanguage must be used within a LanguageProvider')
        return {
            language: 'es' as Language,
            t: translations['es'],
            toggleLanguage: () => { },
            setLanguage: () => { }
        }
    }
    return context
}
