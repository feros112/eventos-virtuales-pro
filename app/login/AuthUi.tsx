'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { login, signup } from './actions'
import { ArrowLeft, Zap } from 'lucide-react'
import Link from 'next/link'
import { clsx } from 'clsx'

function ClientDate() {
    const [date, setDate] = useState('')
    useEffect(() => {
        setDate(new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }))
    }, [])
    return <>{date}</>
}

export default function AuthUi({ message }: { message?: string }) {
    const [view, setView] = useState<'login' | 'register'>('login')

    return (
        <div className="min-h-screen relative overflow-hidden font-sans">
            <AnimatePresence mode='wait'>

                {/* ========================================================================
                    VIEW: LOGIN (BLUE THEME + WHITE CARD)
                   ======================================================================== */}
                {view === 'login' && (
                    <motion.div
                        key="login"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-screen bg-blue-900 relative flex items-center justify-center p-4"
                    >
                        {/* Background Elements */}
                        <div className="absolute inset-0 z-0">
                            {/* Blue Gradient Background - Simulating the 'confetti' image with CSS or simple image */}
                            <img
                                src="https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=2574&auto=format&fit=crop"
                                alt="Blue Party"
                                className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
                            />
                            <div className="absolute inset-0 bg-blue-900/80 mix-blend-multiply" />
                            <div className="absolute top-0 right-0 p-10 lg:p-20 text-blue-200/20 font-black text-6xl md:text-8xl lg:text-9xl tracking-tighter select-none z-0">
                                <ClientDate />
                            </div>
                        </div>

                        {/* Huge WATERMARK TEXT (Background Layer) */}
                        <div className="absolute left-0 bottom-1/2 translate-y-1/2 md:translate-y-0 md:top-1/2 -translate-x-[10%] text-[10vw] font-black leading-none tracking-tighter text-white/5 select-none z-0 pointer-events-none whitespace-nowrap">
                            eVENTOS VIRTUALES PRO
                        </div>

                        {/* Floating White Card */}
                        <div className="relative z-20 w-full max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">

                            {/* Left Side: Title */}
                            <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white relative">
                                <h2 className="text-4xl md:text-5xl font-bold text-slate-300 tracking-tighter mb-4">ACCESO</h2>
                                <div className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                                    EVENTOS<br />
                                    VIRTUALES<br />
                                    <span className="text-blue-600">PRO</span>
                                </div>
                            </div>

                            {/* Right Side: Form */}
                            <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-slate-50">
                                <form className="flex flex-col gap-6">

                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">CORREO ELECTRÓNICO</label>
                                            <input
                                                name="email"
                                                type="email"
                                                required
                                                className="w-full border-b-2 border-slate-200 bg-transparent py-2 text-slate-900 font-bold outline-none focus:border-blue-600 transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">CONTRASEÑA</label>
                                            <input
                                                name="password"
                                                type="password"
                                                required
                                                className="w-full border-b-2 border-slate-200 bg-transparent py-2 text-slate-900 font-bold outline-none focus:border-blue-600 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {message && (
                                        <div className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded">
                                            {message}
                                        </div>
                                    )}

                                    <div className="pt-6 flex flex-col sm:flex-row gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setView('register')}
                                            className="flex-1 py-3 px-6 rounded-full border-2 border-blue-600 text-blue-600 font-bold text-xs md:text-sm uppercase tracking-widest hover:bg-blue-50 transition-all text-center"
                                        >
                                            CREAR CUENTA
                                        </button>
                                        <button
                                            formAction={login}
                                            className="flex-1 py-3 px-6 rounded-full bg-blue-600 text-white font-bold text-xs md:text-sm uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/30 transition-all"
                                        >
                                            ENTRAR
                                        </button>
                                    </div>

                                    <div className="text-center pt-4">
                                        <a href="#" className="text-xs text-slate-400 hover:text-blue-600 transition-colors font-medium">¿Olvidaste tu contraseña?</a>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Footer Links (Absolute Bottom) */}
                        <div className="absolute bottom-6 left-0 w-full flex justify-center md:justify-start md:pl-10 text-[10px] md:text-xs font-bold text-white/50 uppercase tracking-widest gap-4 md:gap-8 z-20">
                            <Link href="#" className="hover:text-white transition-colors">Aviso Legal</Link>
                            <Link href="#" className="hover:text-white transition-colors">Mapa del Sitio</Link>
                            <Link href="#" className="hover:text-white transition-colors">Eventos Pro</Link>
                        </div>
                    </motion.div>
                )}


                {/* ========================================================================
                    VIEW: REGISTER (PURPLE THEME + SPLIT SCREEN)
                   ======================================================================== */}
                {view === 'register' && (
                    <motion.div
                        key="register"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.5 }}
                        className="w-full min-h-screen bg-slate-950 flex flex-col lg:flex-row"
                    >
                        {/* --- LEFT COLUMN: BRANDING & HERO --- */}
                        <div className="lg:w-[65%] relative bg-indigo-900 overflow-hidden flex flex-col justify-between p-8 md:p-12 lg:p-20 text-white min-h-[400px] lg:min-h-screen">
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1974&auto=format&fit=crop"
                                    alt="Concert Crowd"
                                    className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/90 via-purple-900/40 to-cyan-500/30" />
                            </div>

                            {/* Top Branding (Back Button) */}
                            <div className="relative z-10">
                                <button
                                    onClick={() => setView('login')}
                                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
                                >
                                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                    <span className="font-bold tracking-widest text-sm">VOLVER AL ACCESO</span>
                                </button>
                            </div>

                            {/* Center Message */}
                            <div className="relative z-10 my-auto max-w-2xl mt-20 lg:mt-auto">
                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
                                    BIENVENIDO<br />
                                    A VIRTUAL
                                </h1>
                                <p className="text-lg md:text-xl text-indigo-100 font-light max-w-lg leading-relaxed border-l-4 border-cyan-400 pl-6">
                                    Únete a la experiencia inmersiva definitiva. Crea tu cuenta para acceder a eventos exclusivos.
                                </p>
                            </div>

                            {/* Logo Watermark */}
                            <div className="absolute bottom-[-5%] right-[-5%] text-9xl font-black text-white/5 tracking-tighter select-none pointer-events-none">
                                REGISTRO
                            </div>
                        </div>

                        {/* --- RIGHT COLUMN: REGISTRATION FORM --- */}
                        <div className="lg:w-[35%] bg-[#2e1065] text-white flex flex-col relative z-20 -mt-10 lg:mt-0 rounded-t-[40px] lg:rounded-none lg:rounded-tl-[60px] shadow-[-20px_0_60px_rgba(0,0,0,0.5)] overflow-y-auto">
                            <div className="p-8 md:p-12 flex-1 relative">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold mb-1">REGISTRO</h2>
                                    <div className="h-1 w-20 bg-cyan-400 rounded-full" />
                                </div>

                                <form className="space-y-6">
                                    {/* Account Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider border-b border-indigo-500/30 pb-2">Credenciales de Cuenta</h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            <input name="email" type="email" placeholder="Correo Electrónico*" required className="w-full bg-white text-slate-900 placeholder:text-slate-400 px-4 py-3 rounded text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-400" />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input name="password" type="password" placeholder="Contraseña*" required className="w-full bg-white text-slate-900 placeholder:text-slate-400 px-4 py-3 rounded text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-400" />
                                                <input type="password" placeholder="Confirmar*" className="w-full bg-white text-slate-900 placeholder:text-slate-400 px-4 py-3 rounded text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Personal Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider border-b border-indigo-500/30 pb-2">Detalles del Perfil</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="text" placeholder="Nombre" className="w-full bg-white/90 text-slate-900 placeholder:text-slate-400 px-4 py-3 rounded text-sm outline-none focus:ring-2 focus:ring-cyan-400" />
                                            <input type="text" placeholder="Apellido" className="w-full bg-white/90 text-slate-900 placeholder:text-slate-400 px-4 py-3 rounded text-sm outline-none focus:ring-2 focus:ring-cyan-400" />
                                        </div>
                                        <input type="text" placeholder="Empresa / Organización" className="w-full bg-white/90 text-slate-900 placeholder:text-slate-400 px-4 py-3 rounded text-sm outline-none focus:ring-2 focus:ring-cyan-400" />
                                    </div>

                                    {message && (
                                        <div className="p-3 bg-red-500/20 border border-red-500 text-red-200 text-xs font-bold rounded">
                                            {message}
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <button
                                            formAction={signup}
                                            className="w-full py-4 bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-black text-sm uppercase tracking-widest rounded shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all hover:scale-[1.02]"
                                        >
                                            COMPLETAR REGISTRO
                                        </button>
                                        <p className="text-center text-xs text-indigo-300 mt-4">
                                            ¿Ya tienes cuenta? <button type="button" onClick={() => setView('login')} className="text-white hover:text-cyan-400 underline font-bold">Entrar</button>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
