'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Hand, Check, X, Clock, RefreshCw, ShieldAlert, Users, Activity, ExternalLink, Zap } from 'lucide-react'
import { useLanguage } from '@/app/context/LanguageContext'

// Type definition for Interaction Event
type InteractionEvent = {
    id: string
    created_at: string
    user_id: string
    type: string
    status: 'pending' | 'approved' | 'dismissed'
    payload: {
        email: string
        timestamp: string
    }
}

export default function ModerationPage() {
    const [events, setEvents] = useState<InteractionEvent[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()
    const { t } = useLanguage()

    // Fetch initial data
    const fetchEvents = async () => {
        setLoading(true)
        const { data } = await supabase
            .from('interaction_events')
            .select('*')
            .eq('type', 'raise_hand')
            .eq('status', 'pending')
            .order('created_at', { ascending: true }) // Oldest first (FIFO)

        if (data) setEvents(data as InteractionEvent[])
        setLoading(false)
    }

    useEffect(() => {
        fetchEvents()

        // Realtime Subscription
        const channel = supabase
            .channel('moderation_dashboard')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'interaction_events', filter: "type=eq.raise_hand" },
                (payload) => {
                    fetchEvents()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Actions
    const handleAction = async (id: string, action: 'approved' | 'dismissed') => {
        // Optimistic UI update
        setEvents(prev => prev.filter(e => e.id !== id))

        const { error } = await supabase
            .from('interaction_events')
            .update({ status: action })
            .eq('id', id)

        if (error) {
            console.error('Error updating status:', error)
            fetchEvents() // Revert
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 selection:bg-cyan-500/30 font-sans">
            {/* --- OVERWATCH HEADER --- */}
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8 relative">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                        <ShieldAlert className="w-8 h-8 text-amber-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase mb-1">
                            {t.moderation.title}
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Terminal_de_Supervisión</span>
                            <div className="h-[1px] w-8 bg-amber-500/30" />
                            <span className="text-[10px] font-bold text-amber-500/50 uppercase tracking-widest">Transmisión_En_Vivo_Segura</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 md:flex-none flex items-center gap-6 bg-white/[0.02] border border-white/5 px-6 py-3 rounded-2xl backdrop-blur-xl">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Estado de la Cola</span>
                            <div className="flex items-center gap-2">
                                <Activity className="w-3 h-3 text-emerald-500" />
                                <span className="text-2xl font-mono font-black text-white leading-none">{events.length}</span>
                            </div>
                        </div>
                        <div className="h-8 w-[1px] bg-white/10" />
                        <button
                            onClick={fetchEvents}
                            className={`p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all ${loading ? 'opacity-50' : ''}`}
                        >
                            <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto">
                {events.length === 0 ? (
                    <div className="group relative py-32 text-center overflow-hidden rounded-[40px] border-2 border-dashed border-white/5 bg-white/[0.01] transition-all hover:bg-white/[0.02] hover:border-white/10">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-indigo-500/[0.02] pointer-events-none" />
                        <div className="relative z-10">
                            <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Zap className="w-10 h-10 text-white/10 group-hover:text-amber-500/40 transition-colors" />
                            </div>
                            <h2 className="text-xl font-black text-white/40 uppercase tracking-[0.4em] mb-2">{t.moderation.noHands}</h2>
                            <p className="text-white/20 text-xs font-bold uppercase tracking-widest">{t.moderation.chatMonitor}</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {events.map((event, index) => (
                            <div
                                key={event.id}
                                className="group relative bg-[#0a1224]/80 border border-white/5 rounded-[28px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-3xl transition-all duration-300 hover:border-amber-500/30 hover:shadow-[0_0_40px_rgba(245,158,11,0.05)] animate-in slide-in-from-bottom-4 duration-500"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-full opacity-40 group-hover:opacity-100 transition-opacity" />

                                <div className="flex items-center gap-6 w-full">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-lg group-hover:bg-amber-500 group-hover:text-black transition-all">
                                            <Hand className="w-8 h-8 animate-pulse" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-lg flex items-center justify-center text-[10px] font-black text-white border-2 border-[#0a1224]">
                                            !
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-black text-xl text-white tracking-tight">{event.payload?.email || 'REQUEST_IDENT_PENDING'}</h3>
                                            <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] font-black text-white/40 uppercase tracking-widest">Asistente</div>
                                        </div>
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3 h-3 text-amber-500/50" />
                                                <span>Esperando desde las {new Date(event.created_at).toLocaleTimeString()}</span>
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-white/10" />
                                            <div className="flex items-center gap-1.5 opacity-60">
                                                <Users className="w-3 h-3" />
                                                <span>UID: {event.user_id.substring(0, 8)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 w-full md:w-auto">
                                    <button
                                        onClick={() => handleAction(event.id, 'dismissed')}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/5 text-white/40 font-black text-[10px] uppercase tracking-widest transition-all hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 active:scale-95"
                                    >
                                        <X className="w-4 h-4" />
                                        {t.moderation.dismiss}
                                    </button>
                                    <button
                                        onClick={() => handleAction(event.id, 'approved')}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500 text-[#020617] font-black text-[10px] uppercase tracking-widest transition-all hover:bg-emerald-400 shadow-[0_10px_30px_rgba(16,185,129,0.2)] hover:shadow-[0_10px_40px_rgba(16,185,129,0.4)] active:scale-95"
                                    >
                                        <Check className="w-4 h-4" />
                                        {t.common.save}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* --- SYSTEM HUD (Visual only) --- */}
            <div className="fixed bottom-10 left-10 pointer-events-none opacity-10">
                <div className="flex flex-col gap-2">
                    <div className="h-1 w-24 bg-white rounded-full" />
                    <div className="h-1 w-16 bg-white rounded-full" />
                    <div className="text-[10px] font-black text-white uppercase tracking-[1em] mt-4">SECURE_CORE</div>
                </div>
            </div>
        </div>
    )
}
