'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, MessageSquare, Send, Users, Hand, MessageSquareOff, ChevronRight, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import ChatBox from '../ChatBox'
import MainStageExperience from './MainStageExperience'
import { createClient } from '@/utils/supabase/client'
import { useLanguage } from '../../context/LanguageContext'

interface AuditoriumLayoutProps {
    streamUrl: string
    isLive: boolean
    userEmail: string
    userId: string
    streamTitle: string
}

export default function AuditoriumLayout({ streamUrl, isLive, userEmail, userId, streamTitle }: AuditoriumLayoutProps) {
    const [isChatOpen, setIsChatOpen] = useState(true)
    const [handRaised, setHandRaised] = useState(false)
    const { t } = useLanguage()
    const supabase = createClient()

    // 1. Check Initial State & Realtime Subscription
    useEffect(() => {
        const checkHand = async () => {
            const { data } = await supabase
                .from('interaction_events')
                .select('*')
                .eq('user_id', userId)
                .eq('type', 'raise_hand')
                .eq('status', 'pending')
                .single()

            if (data) setHandRaised(true)
        }
        checkHand()

        const channel = supabase
            .channel('interaction_events_user')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'interaction_events', filter: `user_id=eq.${userId}` }, (payload) => {
                if (payload.new && 'status' in payload.new) {
                    if ((payload.new as any).status !== 'pending') setHandRaised(false)
                } else if (payload.eventType === 'DELETE') {
                    setHandRaised(false)
                }
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [userId, supabase])


    // 2. Toggle Hand
    const toggleHand = async () => {
        if (handRaised) {
            setHandRaised(false)
            await supabase.from('interaction_events').delete().match({ user_id: userId, type: 'raise_hand', status: 'pending' })
        } else {
            setHandRaised(true)
            await supabase.from('interaction_events').insert({
                user_id: userId,
                type: 'raise_hand',
                status: 'pending',
                payload: { email: userEmail, timestamp: new Date().toISOString() }
            })
        }
    }

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden">
            {/* Navbar (Client Header) */}
            <nav className="h-[60px] border-b border-white/10 bg-black/40 backdrop-blur-md px-4 flex justify-between items-center z-50 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/lobby" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Lobby</span>
                    </Link>
                    <div className="h-4 w-px bg-white/10 hidden sm:block" />
                    <span className="font-bold text-indigo-400 text-sm md:text-base truncate max-w-[200px]">{streamTitle}</span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Raise Hand Button */}
                    <button
                        onClick={toggleHand}
                        className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${handRaised ? 'bg-amber-500 text-black animate-pulse' : 'bg-white/10 hover:bg-white/20 text-slate-300'}`}
                    >
                        <Hand className="w-3 h-3" />
                        {handRaised ? t.auditorium.handRaised : t.auditorium.raiseHand}
                    </button>

                    {/* Toggle Chat Button */}
                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className={`p-2 rounded-lg transition-colors ${isChatOpen ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                        title={isChatOpen ? t.auditorium.toggleChat : t.auditorium.toggleChat}
                    >
                        {isChatOpen ? <MessageSquareOff className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                    </button>
                </div>
            </nav>

            <main className="flex-1 flex relative overflow-hidden">
                {/* Main Stage (3D) - Auto resizes with flex */}
                <div className={`transition-all duration-300 relative ${isChatOpen ? 'w-full md:w-[calc(100%-350px)]' : 'w-full'} h-full bg-black`}>
                    <MainStageExperience streamUrl={streamUrl} isLive={isLive} />

                    {/* Mobile Floating Controls */}
                    {!isChatOpen && (
                        <div className="absolute top-4 right-4 z-40 md:hidden">
                            <div className="bg-black/50 backdrop-blur text-xs px-2 py-1 rounded border border-white/10">
                                {t.auditorium.stageOnly}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar (Chat) - Collapsible */}
                <div
                    className={`
                        fixed md:relative top-[60px] md:top-0 right-0 bottom-0
                        w-[85vw] md:w-[350px]
                        bg-slate-900 border-l border-white/10 z-30
                        transform transition-transform duration-300 ease-in-out
                        ${isChatOpen ? 'translate-x-0' : 'translate-x-full md:hidden'}
                    `}
                >
                    <ChatBox userEmail={userEmail} />
                </div>
            </main>
        </div>
    )
}
