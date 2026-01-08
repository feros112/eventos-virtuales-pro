'use client'

import { ArrowRight, MonitorPlay, Zap, Users, Coins } from "lucide-react";
import Link from "next/link";
import { useLanguage } from '../context/LanguageContext'

export default function LandingPage() {
    const { t } = useLanguage()

    return (
        <div className="min-h-screen flex flex-col items-center bg-slate-950 text-white selection:bg-purple-500 selection:text-white overflow-hidden">

            {/* Navbar */}
            <nav className="absolute top-0 w-full p-6 flex justify-between items-center max-w-7xl mx-auto z-50">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/30">
                        P
                    </div>
                    <div className="text-xl font-bold tracking-tighter text-white">
                        PRO <span className="text-purple-400">EVENTS</span>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors backdrop-blur-sm bg-black/30 rounded-full border border-white/5">
                        {t.auth.signInBtn}
                    </Link>
                    <button className="px-5 py-2 text-sm font-bold bg-white text-black hover:bg-slate-200 rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        Crear Evento
                    </button>
                </div>
            </nav>

            {/* HERO SECTION WITH VIDEO BACKGROUND FEEL */}
            <main className="w-full relative flex flex-col items-center justify-center min-h-screen text-center px-4">

                {/* Background Image with Overlay */}
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950 z-10" />
                    {/* Abstract Background instead of Image to prevent load errors */}
                    <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 animate-pulse-slow" style={{ animationDuration: '4s' }} />
                </div>

                <div className="relative z-20 max-w-5xl mx-auto mt-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-900/40 border border-indigo-500/30 text-xs font-bold text-indigo-300 mb-8 backdrop-blur-md uppercase tracking-widest shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                        <Zap className="w-3 h-3 fill-current" />
                        La Nueva Era de los Eventos
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 drop-shadow-2xl">
                        VIVE LA <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 animate-gradient">
                            ADRENALINA VIRTUAL
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                        No es solo un zoom. Es una experiencia inmersiva cinematográfica.
                        <span className="text-white font-medium"> Monetiza</span>, <span className="text-white font-medium">impacta</span> y <span className="text-white font-medium">conecta</span> como nunca antes.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
                        <Link href="/lobby" className="group h-14 px-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_50px_rgba(79,70,229,0.6)] hover:scale-105">
                            {t.lobby.enter}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="h-14 px-10 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all backdrop-blur-md">
                            Ver Demo en Vivo
                        </button>
                    </div>
                </div>
            </main>

            {/* VISUAL SHOWCASE GRID (MASONRY) */}
            <section className="w-full max-w-7xl mx-auto px-6 py-32 relative z-20">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Diseñado para Impresionar</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">Una interfaz tan atractiva que tus usuarios no querrán cerrar la pestaña.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[800px] md:h-[600px]">
                    {/* Card 1: Large Left */}
                    <div className="md:col-span-2 relative rounded-3xl overflow-hidden border border-white/10 group cursor-pointer bg-slate-900">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        {/* Gradient Placeholder */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900 opacity-60 transition-transform duration-700 group-hover:scale-105" />

                        <div className="absolute bottom-0 left-0 p-8 z-20">
                            <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
                                <MonitorPlay className="w-5 h-5" /> STREAMING 4K
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-2">Calidad Cinematográfica</h3>
                            <p className="text-slate-300">Transmite en ultra-alta definición sin latencia.</p>
                        </div>
                    </div>

                    {/* Card 2: Top Right */}
                    <div className="relative rounded-3xl overflow-hidden border border-white/10 group cursor-pointer bg-slate-900">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        {/* Gradient Placeholder */}
                        <div className="absolute inset-0 bg-gradient-to-bl from-purple-900 via-fuchsia-900 to-rose-900 opacity-60 transition-transform duration-700 group-hover:scale-105" />

                        <div className="absolute bottom-0 left-0 p-6 z-20">
                            <div className="flex items-center gap-2 text-purple-400 font-bold mb-2">
                                <Users className="w-5 h-5" /> {t.lobby.rooms.networking}
                            </div>
                            <h3 className="text-2xl font-bold text-white">Social Hub</h3>
                        </div>
                    </div>

                    {/* Card 3: Bottom Right */}
                    <div className="relative rounded-3xl overflow-hidden border border-white/10 group cursor-pointer bg-slate-900">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        {/* Gradient Placeholder */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900 via-teal-900 to-cyan-900 opacity-60 transition-transform duration-700 group-hover:scale-105" />

                        <div className="absolute bottom-0 left-0 p-6 z-20">
                            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                                <Coins className="w-5 h-5" /> ROI
                            </div>
                            <h3 className="text-2xl font-bold text-white">Monetización</h3>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="w-full border-t border-slate-900 bg-slate-950 py-10 text-center text-slate-500 text-sm">
                © 2026 PRO Iwebolutions. <span className="text-slate-700">|</span> Next Gen Virtual Events.
            </footer>
        </div>
    );
}
