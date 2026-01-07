'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Menu, User, LogOut, MessageSquare, Map, Compass, X, HelpCircle } from 'lucide-react'
import QuickNavigation from '../auditorio/QuickNavigation'
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
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans">
            {/* --- HEADER (White Style) --- */}
            <header className="h-16 bg-white border-b border-gray-200 flex justify-between items-center px-4 md:px-8 z-50 relative shrink-0 shadow-sm">

                {/* Logo Area */}
                <div className="flex items-center gap-2">
                    {/* Placeholder Logo Icon */}
                    <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md">
                        PRO
                    </div>
                    <div className="hidden md:block">
                        <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-none">
                            EVENTOS <span className="text-rose-500">PRO</span>
                        </h1>
                        <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Virtual Experience</p>
                    </div>
                </div>

                {/* Right Menu */}
                <div className="flex items-center gap-4 md:gap-6">
                    <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <button className="hover:text-rose-500 transition-colors">Agenda</button>
                        <button className="hover:text-rose-500 transition-colors">Sponsors</button>
                        <button className="hover:text-rose-500 transition-colors">Soporte</button>
                    </nav>

                    <div className="h-6 w-px bg-gray-200 hidden md:block" />

                    <div className="flex items-center gap-2">
                        <div className="flex flex-col items-end mr-2 hidden sm:block">
                            <span className="text-xs font-bold text-slate-700">{profile?.full_name || 'Invitado'}</span>
                            <span className="text-[10px] text-slate-400">ID: {profile?.id?.substring(0, 4)}</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs ring-offset-2 ring-1 ring-transparent hover:ring-rose-200 transition-all">
                            {userEmail?.substring(0, 2).toUpperCase()}
                        </div>

                        <button
                            onClick={() => signOutAction()}
                            className="ml-2 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
                            title="Cerrar Sesión"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* --- MAIN CONTENT (3D Canvas) --- */}
            <main className="flex-1 relative bg-slate-900 overflow-hidden">
                {/* 3D Scene Container */}
                <div className="absolute inset-0 z-0">
                    <Experience />
                </div>

                {/* Quick Nav Overlay (Drawer from bottom) */}
                <div className={clsx(
                    "absolute bottom-0 left-0 w-full z-30 transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)",
                    showQuickNav ? "translate-y-0" : "translate-y-[120%]"
                )}>
                    {/* Glassmorphism Panel */}
                    <div className="bg-slate-900/95 backdrop-blur-xl border-t border-white/10 pt-4 pb-8 px-4 md:px-8 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] max-w-7xl mx-auto md:mb-4 md:rounded-3xl md:border md:border-white/10">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/30">
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                                <h3 className="text-rose-400 font-bold text-xs uppercase tracking-widest">{t.lobby.rooms.available || 'SALAS'}</h3>
                            </div>
                            <button
                                onClick={() => setShowQuickNav(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <QuickNavigation rooms={rooms} />
                    </div>
                </div>

                {/* Floating Hint if QuickNav is closed */}
                {!showQuickNav && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-[10px] font-mono pointer-events-none tracking-widest uppercase">
                        {t.lobby.instructions.drag || 'CLIC Y ARRASTRA PARA EXPLORAR'}
                    </div>
                )}
            </main>

            {/* --- FOOTER (White Style) --- */}
            <footer className="h-16 md:h-20 bg-white border-t border-gray-200 flex justify-center md:justify-between items-center px-4 md:px-8 z-50 relative shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">

                {/* Left: Interactive Buttons */}
                <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-start">

                    <button
                        onClick={() => setShowQuickNav(!showQuickNav)}
                        className={clsx(
                            "flex items-center gap-2 md:gap-3 text-xs md:text-sm font-bold uppercase tracking-wider px-4 md:px-6 py-2 md:py-3 rounded-full transition-all border transform active:scale-95 duration-200",
                            showQuickNav
                                ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                                : "bg-white text-slate-600 border-slate-200 hover:border-rose-500 hover:text-rose-500"
                        )}
                    >
                        <Compass className={clsx("w-4 h-4 md:w-5 md:h-5", showQuickNav && "animate-spin-slow")} />
                        <span>{t.lobby.instructions.desktop || 'NAVEGACIÓN'}</span>
                    </button>

                    <button className="hidden md:flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-full text-slate-500 border border-transparent hover:bg-slate-50 transition-all">
                        <Map className="w-4 h-4" />
                        {t.footer?.sitemap || 'MAPA'}
                    </button>

                    {/* Chat button for Mobile (visible only on small screens here if needed, or keeping it right) */}
                    <button className="md:hidden flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full text-slate-500 border border-slate-200 hover:text-indigo-600 transition-all">
                        <MessageSquare className="w-4 h-4" />
                        Chat
                    </button>
                </div>

                {/* Center: Branding watermark */}
                <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 hover:opacity-100 transition-opacity">
                    <span className="font-black text-2xl italic tracking-tighter text-slate-900 cursor-default">BEYOND<span className="text-indigo-600">LIVE</span></span>
                </div>

                {/* Right: Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-all">
                        <span>Chat Global</span>
                        <MessageSquare className="w-4 h-4" />
                    </button>
                </div>
            </footer>
        </div>
    )
}
