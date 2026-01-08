'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Menu, User, LogOut, MessageSquare, Map, Compass, X, HelpCircle } from 'lucide-react'
import QuickNavigation from '../auditorio/QuickNavigation'
import LobbyHud from './LobbyHud'
import InstructionsOverlay from './InstructionsOverlay'
import { clsx } from 'clsx'
import { useLanguage } from '../context/LanguageContext'

// Dynamically import Experience
const Experience = dynamic(() => import('./LobbyScene'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-black flex items-center justify-center">
            <div className="text-rose-500 font-bold animate-pulse tracking-widest uppercase text-xs">Cargando Entorno 3D...</div>
        </div>
    )
})

// Video Modal Component
function VideoModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-30 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm pt-20">
            <div className="relative w-full max-w-5xl bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 z-10 p-4 bg-black/50 hover:bg-rose-600/80 text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="aspect-video w-full">
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                        title="Live Stream"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>
            </div>
        </div>
    )
}

export default function LobbyClientWrapper({ userEmail, profile, signOutAction, rooms }: any) {
    const [showQuickNav, setShowQuickNav] = useState(false)
    const [showInstructions, setShowInstructions] = useState(true)
    const { t } = useLanguage()

    return (
        <div className="relative w-full h-screen bg-slate-900 overflow-hidden font-sans text-slate-900">
            {/* --- 3D SCENE (Background) --- */}
            <div className="absolute inset-0 z-0">
                <Experience />
            </div>

            {/* --- HUD OVERLAY --- */}
            <LobbyHud
                userEmail={userEmail}
                onSignOut={signOutAction}
                onOpenChat={() => console.log('Open Chat')}
                onOpenMap={() => console.log('Open Map')}
                onOpenQuickNav={() => setShowQuickNav(!showQuickNav)}
            />

            {/* --- QUICK NAV DRAWER (White Theme) --- */}
            <div className={clsx(
                "absolute bottom-20 left-0 w-full z-40 transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) pointer-events-none",
                showQuickNav ? "translate-y-0" : "translate-y-[150%]"
            )}>
                <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border-t border-slate-200 pt-4 pb-8 px-4 md:px-8 rounded-t-3xl shadow-2xl max-w-7xl mx-auto md:rounded-3xl md:border md:border-slate-200 mx-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            <h3 className="text-indigo-900 font-bold text-xs uppercase tracking-widest">{t.lobby.rooms.available || 'SALAS DISPONIBLES'}</h3>
                        </div>
                        <button
                            onClick={() => setShowQuickNav(false)}
                            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    {/* Reuse existing QuickNavigation but might need style tweaks inside it too? 
                        For now, usage is fine, but checking QuickNavigation styles later is a good idea.
                    */}
                    <QuickNavigation rooms={rooms} />
                </div>
            </div>

            {/* --- VIDEO MODAL (If needed) --- */}
            {/* (Kept relevant logic if it was used, but VideoModal definitions were above) */}
        </div>
    )
}
