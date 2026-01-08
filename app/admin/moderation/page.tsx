'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Hand, Check, X, Clock, RefreshCw } from 'lucide-react'
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
                    // Simple strategy: Just refetch on any change to keep list accurate
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
            alert(t.common.error || 'Error')
            fetchEvents() // Revert
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-600">
                        {t.moderation.title}
                    </h1>
                    <p className="text-slate-400">{t.moderation.handRaiseQueue}</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={fetchEvents} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                        <span className="text-slate-400 text-sm uppercase font-bold mr-2">{t.moderation.handRaiseQueue}:</span>
                        <span className="text-2xl font-mono font-bold text-amber-500">{events.length}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto">
                {events.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
                        <Hand className="w-16 h-16 mx-auto text-slate-700 mb-4" />
                        <h2 className="text-xl font-bold text-slate-500">{t.moderation.noHands}</h2>
                        <p className="text-slate-600">{t.moderation.chatMonitor}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {events.map((event) => (
                            <div key={event.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg animate-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                                        <Hand className="w-6 h-6 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">{event.payload?.email || t.moderation.user}</h3>
                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                                            <Clock className="w-3 h-3" />
                                            <span>{new Date(event.created_at).toLocaleTimeString()}</span>
                                            <span className="text-slate-600">|</span>
                                            <span>ID: {event.user_id.substring(0, 6)}...</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 w-full md:w-auto">
                                    <button
                                        onClick={() => handleAction(event.id, 'dismissed')}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all border border-transparent hover:border-slate-600"
                                    >
                                        <X className="w-4 h-4" />
                                        {t.moderation.dismiss}
                                    </button>
                                    <button
                                        onClick={() => handleAction(event.id, 'approved')}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg hover:shadow-emerald-500/20"
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
        </div>
    )
}
