'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, MessageSquare, UserPlus, Filter, ShieldCheck, Globe } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

interface Profile {
    id: string
    full_name: string | null
    email: string
    role: string
    company?: string | null
    created_at: string
}

export default function NetworkingClient({ initialAttendees }: { initialAttendees: Profile[] }) {
    const { t } = useLanguage()
    const [search, setSearch] = useState('')

    const filteredAttendees = initialAttendees.filter(person => {
        const nameMatch = person.full_name?.toLowerCase().includes(search.toLowerCase())
        const emailMatch = person.email.toLowerCase().includes(search.toLowerCase())
        const companyMatch = person.company?.toLowerCase().includes(search.toLowerCase())
        return nameMatch || emailMatch || companyMatch
    })

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans selection:bg-indigo-500/30">

            {/* Navbar - Glassmorphism */}
            <nav className="fixed top-0 w-full border-b border-white/5 bg-[#020617]/40 backdrop-blur-xl px-10 py-6 flex justify-between items-center z-50">
                <div className="flex items-center gap-6">
                    <Link href="/lobby" className="flex items-center gap-3 text-white/40 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em] group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        {t.networking.backToLobby}
                    </Link>
                    <div className="h-4 w-px bg-white/10" />
                    <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-indigo-500" />
                        <span className="font-black text-xs text-white uppercase tracking-[0.2em]">{t.networking.title}</span>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-2 bg-indigo-500/5 px-4 py-1.5 rounded-full border border-indigo-500/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{initialAttendees.length} CONECTADOS</span>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl mx-auto w-full px-10 pt-32 pb-20">

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-[0.3em] rounded-md mb-6 border border-indigo-500/20">
                            <ShieldCheck className="w-3 h-3" /> Conexión Segura
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tighter uppercase leading-none italic italic">
                            {t.networking.title} <span className="text-indigo-500">LIVE</span>
                        </h1>
                        <p className="text-white/40 text-lg font-bold uppercase tracking-tight max-w-xl leading-relaxed">{t.networking.subtitle}</p>
                    </div>

                    <div className="flex gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-[400px] group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t.networking.searchPlaceholder}
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white placeholder:text-white/10 focus:outline-none focus:border-indigo-500/50 transition-all font-black text-xs uppercase tracking-widest backdrop-blur-md"
                            />
                        </div>
                        <button className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all">
                            <Filter className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Attendees Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAttendees.map((person, index) => (
                        <div
                            key={person.id}
                            className="group relative bg-[#0a1224]/40 border border-white/5 rounded-[40px] p-10 flex flex-col gap-8 backdrop-blur-3xl hover:border-indigo-500/30 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Card Background Glow */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/5 blur-[80px] rounded-full group-hover:bg-indigo-500/10 transition-colors" />

                            <div className="flex items-start gap-6 relative z-10">
                                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-black text-white flex-shrink-0 shadow-[0_0_30px_rgba(99,102,241,0.3)] uppercase">
                                    {person.full_name?.charAt(0) || person.email.charAt(0)}
                                </div>

                                <div className="flex-1 min-w-0 pt-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-black text-2xl truncate text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                                            {person.full_name || person.email.split('@')[0]}
                                        </h3>
                                        {person.role === 'admin' && (
                                            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" title="Staff" />
                                        )}
                                    </div>
                                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] truncate">
                                        {person.company || person.role || 'ASISTENTE'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 relative z-10">
                                <button className="flex-[2] bg-white text-[#020617] hover:bg-indigo-500 hover:text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl">
                                    <MessageSquare className="w-4 h-4 shrink-0" /> {t.networking.chatBtn}
                                </button>
                                <button className="flex-1 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-2xl transition-all border border-white/5 flex items-center justify-center active:scale-95">
                                    <UserPlus className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Status Indicator */}
                            <div className="absolute bottom-10 right-10">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    ))}

                    {filteredAttendees.length === 0 && (
                        <div className="col-span-full py-40 text-center bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[40px]">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-8 h-8 text-white/10" />
                            </div>
                            <p className="text-white/20 font-black uppercase tracking-[0.4em] text-sm">No se encontraron perfiles</p>
                        </div>
                    )}
                </div>

            </main>

            {/* Background Decoration */}
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[150px] rounded-full -z-10" />
            <div className="fixed top-20 left-0 w-[300px] h-[300px] bg-purple-500/5 blur-[120px] rounded-full -z-10" />
        </div>
    )
}
